import { END, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const parentGraphState = z.object({
    question: z.string(),
    englishText: z.string(),
    hindiText: z.string(),
});

const translateSubgraph = new StateGraph(parentGraphState);

async function translate(state) {
    const messages = [
        new SystemMessage("You are a translator, translate the given text to hindi and do not add anything extra"),
        new HumanMessage(state.englishText),
    ];
    const rea = await llm.invoke(messages);
    return { hindiText: rea.content };
}

translateSubgraph.addNode("translate", translate);

translateSubgraph.addEdge(START, "translate");
translateSubgraph.addEdge("translate", END);

const translateGraphWOrkflow = translateSubgraph.compile();

const parentGraph = new StateGraph(parentGraphState);

async function ans(state) {
    const messages = [
        new SystemMessage("you are the helpful assistance, answer the given question in one sentence"),
        new HumanMessage(state.question),
    ];
    const rea = await llm.invoke(messages);
    return { englishText: rea.content };
}

parentGraph.addNode("ans", ans);
parentGraph.addNode("translate", translateGraphWOrkflow);

parentGraph.addEdge(START, "ans");
parentGraph.addEdge("ans", "translate");
parentGraph.addEdge("translate", END);

const parentGraphWorkflow = parentGraph.compile();

const initialState = { question: "what is the capital of india?" };
const state = await parentGraphWorkflow.invoke(initialState);
console.log(state);

/*
{
  question: 'what is the capital of india?',
  englishText: 'The capital of India is New Delhi.',
  hindiText: 'भारत की राजधानी नई दिल्ली है।'
}
*/
