import "dotenv/config";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

async function multiply({ a, b }) {
    return a * b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers",
    schema: schema,
    func: multiply,
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const llm_with_tool = llm.bindTools([multiplyTool]);

const query = new HumanMessage("Multiply 5 and 10.");

const messages = [query];

const response = await llm_with_tool.invoke(messages);

messages.push(response);

const ans = await multiplyTool.invoke(response.tool_calls[0]);

messages.push(ans);

const final_ans = await llm_with_tool.invoke(messages);

console.log(final_ans);

/*
AIMessage {
  "content": "The result of multiplying 5 and 10 is 50.",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "__gemini_function_call_thought_signatures__": {}
  },
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 94,
      "completionTokens": 15,
      "totalTokens": 109
    },
    "finishReason": "STOP",
    "index": 0
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 94,
    "output_tokens": 15,
    "total_tokens": 109
  }
}
*/
