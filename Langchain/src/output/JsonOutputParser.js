import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const parser = new JsonOutputParser();

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const prompt = `give me the list of three programming languages \nin json format`;

const response = await llm.invoke(prompt);

const output = await parser.invoke(response.content);

console.log("Parsed Output:", output);


// Parsed Output: [ 'Python', 'JavaScript', 'Java' ]