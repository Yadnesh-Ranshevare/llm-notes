import { Command, END, interrupt, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const schema = z.object({
    message: z.array(z.string),
});

const graph = new StateGraph(schema);

async function ask_user(state) {
    const userAns = interrupt({ message: "Say something" });
    return { message: userAns.userInput };
}

graph.addNode("ask_user", ask_user);

graph.addEdge(START, "ask_user");
graph.addEdge("ask_user", END);

const workflow = graph.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: "1" } };

const res = await workflow.invoke({ message: [] }, config);

const rl = readline.createInterface({ input, output });

const userInput = await rl.question(res.__interrupt__[0].value.message + "\n");

const finalResult = await workflow.invoke(new Command({ resume: { userInput } }), config);
console.log(finalResult);


/*
Say something
hello
{ message: 'hello' }
*/