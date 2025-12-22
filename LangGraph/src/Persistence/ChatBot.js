import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const checkpointer = new MemorySaver();

// const GraphState = z.object({
//     message:z.array(z.instanceof(BaseMessage))
// })
const GraphState = Annotation.Root({
    message: Annotation({
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(GraphState);

async function ChatBot(state) {
    const response = await llm.invoke(state.message);
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

// while (true) {
//     let message = await rl.question("user: ");
//     let chatHistory = await workflow.getState(config);

//     let state = { message: [] };

//     if (chatHistory.values.message) {
//         chatHistory.values.message.forEach((element) => {
//             state.message.push(element);
//         });
//     }
//     state.message.push(new HumanMessage(message));
//     const res = await workflow.invoke(state, config);
//     console.log(res.message[res.message.length - 1].content);
// }

while (true) {
    let message = await rl.question("user: ");
    const res = await workflow.invoke({ message: [new HumanMessage(message)] }, config);
    console.log(res.message[res.message.length - 1].content);
}

/*
user: hey im yadnesh
Hi Yadnesh! Nice to meet you.

I'm an AI assistant. How can I help you today?
user: can you tell me my name
Your name is Yadnesh! You just told me. 😊
*/
