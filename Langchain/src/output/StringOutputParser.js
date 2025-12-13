import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const parser = new StringOutputParser();

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const response = await llm.invoke("Say hello");

const output = await parser.invoke(response);

console.log("Raw Response:", response);
/*
Raw Response: AIMessage {
  "content": "Hello!",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "__gemini_function_call_thought_signatures__": {}
  },
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 3,
      "completionTokens": 2,
      "totalTokens": 23
    },
    "finishReason": "STOP",
    "index": 0
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 3,
    "output_tokens": 2,
    "total_tokens": 23
  }
}
*/
console.log("pars Output:", output);
// pars Output: Hello!

