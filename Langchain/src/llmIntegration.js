import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// console.log(process.env.API_KEY)
const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const response = await llm.invoke("Explain LangChain in one line.");
console.log(response.content);

// https://generativelanguage.googleapis.com/v1beta/models?key=API_KEY
