import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import Database from "better-sqlite3"; 
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import "dotenv/config";


const db = new Database("./LangGraph/checkpoints.db");
const checkpointer = new SqliteSaver(db);


const GraphState = Annotation.Root({
    message: Annotation({
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(GraphState);

async function ChatBot(state) {
    const response = new AIMessage("Hello");
    return {
        message: [response],
    };
}

graph.addNode("ChatBot", ChatBot);
graph.addEdge(START, "ChatBot");
graph.addEdge("ChatBot", END);

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

const rl = readline.createInterface({ input, output });


while (true) {
    let message = await rl.question("user: ");
    const res = await workflow.invoke({ message: [new HumanMessage(message)] }, config);
    const history = await workflow.getState(config);
    console.log(history.values);
}
// console.log(await workflow.getState(config));

