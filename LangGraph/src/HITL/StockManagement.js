import { Annotation, Command, interrupt, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

async function getStockPrice({ symbol }) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

function purchaseStock({ symbol, quantity }) {
    const approved = interrupt(`Approve buying ${quantity} shears of ${symbol} (y/n)`);
    if (approved === "y") {
        return {
            status: 200,
            message: "stock purchase successfully",
            symbol,
            quantity,
        };
    } else {
        return {
            status: 400,
            message: "stock purchase failed",
        };
    }
}

const stockPice = new DynamicStructuredTool({
    name: "get_stock_price",
    description: "use this tool to get stock price",
    func: getStockPrice,
    schema: z.object({
        symbol: z.string(),
    }),
});

const purchaseStockTool = new DynamicStructuredTool({
    name: "purchase_stock",
    description: "use this tool to purchase stock",
    func: purchaseStock,
    schema: z.object({
        symbol: z.string(),
        quantity: z.number(),
    }),
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const llm_with_tool = llm.bindTools([stockPice, purchaseStockTool]);

const graphState = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        defaultValue: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(graphState);

const toolNode = new ToolNode([stockPice, purchaseStockTool]);

async function ChatNode(state) {
    const res = await llm_with_tool.invoke(state.messages);
    return { messages: [res] };
}

graph.addNode("chat_node", ChatNode);
graph.addNode("tools", toolNode);

graph.addEdge(START, "chat_node");
graph.addConditionalEdges("chat_node", toolsCondition);
graph.addEdge("tools", "chat_node");

const checkpointer = new MemorySaver();

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

const rl = readline.createInterface({ input, output });

while (true) {
    let message = await rl.question("user: ");
    let res = await workflow.invoke({ messages: [new HumanMessage(message)] }, config);
    if (res.__interrupt__) {
        const userInput = await rl.question(res.__interrupt__[0].value + " ");
        res = await workflow.invoke(new Command({ resume: userInput.toString().toLocaleLowerCase() }), config);
    }
    console.log(res.messages[res.messages.length - 1].content + "\n");
}

// output 1: for yes case
/*
user: hey
Hello! How can I help you today?


user: what is the stock price of IBM
The stock price of IBM is 303.78.

user: buy 10 stock of it for me
Approve buying 10 shears of IBM (y/n) y
You have successfully purchased 10 stocks of IBM.
*/


// output 2: for no case
/*
user: what is the stock price of google
The stock price of GOOG is 315.6800.

user: but 4 stock of it
Approve buying 4 shears of GOOG (y/n) n
Sorry, I was not able to purchase the stock. Stock purchase failed.
*/
