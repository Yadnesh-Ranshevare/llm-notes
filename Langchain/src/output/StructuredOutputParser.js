import z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";

const schema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
    })
);

const parser = StructuredOutputParser.fromZodSchema(schema);

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const prompt = `give me the list of three programming languages \n${parser.getFormatInstructions()}`;

const response = await llm.invoke(prompt);

const output = await parser.invoke(response.content);

console.log("Parsed Output:", output);

/**
Parsed Output: [
  { id: 1, name: 'Python' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Java' }
]
 */