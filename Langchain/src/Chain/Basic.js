import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = new PromptTemplate({
    template: "Explain {topic} in simple 2 sentences.",
    inputVariables: ["topic"],
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const parser = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(parser)

const result = await chain.invoke({ topic: "REST API" });
console.log(result);
