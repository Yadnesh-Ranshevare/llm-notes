import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, DynamicStructuredTool } from "langchain";
import { z } from "zod";

const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const calculatorTool = new DynamicStructuredTool({
    name: "calculator",
    description: "Useful for math calculations",
    schema,
    func: async ({ a, b }) => {
        return a + b;
    },
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const agent = createAgent({
    model: llm,
    tools: [calculatorTool],
});

const result = await agent.invoke({ messages: [{ role: "user", content: "What is 5 + 10?" }] });

console.log(result);

/*
{
  messages: [
    HumanMessage {
      "id": "c8d061b4-4ef6-4d40-85af-cb9bc38c0343",
      "content": "What is 5 + 10?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "915ce7b4-6745-4bdb-bd73-e27b94e80e0b",
      "content": [
        {
          "type": "functionCall",
          "functionCall": {
            "name": "calculator",
            "args": "[Object]"
          }
        }
      ],
      "name": "model",
      "additional_kwargs": {
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s).",
        "__gemini_function_call_thought_signatures__": {
          "0ea84909-014b-4765-84fe-32ecb68e9b19": "CpcCAXLI2nw+W6bmpUrPuWNGh8ssWeqGYUs/5jAONHpugk4umI1IV2Bzmp2+cmDv1WC4d0WzC1h/UuGdgNmDwPZE72c4qr4r4DtJPKm2QhxQVIgMgZZ56g9XUh66FKjIrJ+90+5OV3Pj4ytXR/shnymRd50eWLstjjQJj49aglATc88AbTF7DMMx0K7ktAIxwunZg6PbKvKUr/3T2LVHdn5qMXTxxQ6vXPmQ8RIZ3lgC9vgNJ6ioIj0+ehlVwcorpbptkEbE3J/qllwIAQgr6c9HEQiZOFOeQsG8YFu5W0MSiL3Iv+Uow1+X2hF4C/gTVOol8ZbMQb8DCAZr2M5OQk6R5cW3tXKWLPsIglRjoDyPqM74CKW224Ct"
        }
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 55,
          "completionTokens": 19,
          "totalTokens": 142
        },
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s)."
      },
      "tool_calls": [
        {
          "type": "tool_call",
          "id": "0ea84909-014b-4765-84fe-32ecb68e9b19",
          "name": "calculator",
          "args": {
            "b": 10,
            "a": 5
          }
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 55,
        "output_tokens": 19,
        "total_tokens": 142
      }
    },
    ToolMessage {
      "id": "8448dbbf-6027-4337-8625-d4eeeaf78645",
      "content": "15",
      "name": "calculator",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "0ea84909-014b-4765-84fe-32ecb68e9b19"
    },
    AIMessage {
      "id": "3df75227-2dc9-4a89-87bd-6b6fc4d379a5",
      "content": "The answer is 15.",
      "name": "model",
      "additional_kwargs": {
        "finishReason": "STOP",
        "index": 0,
        "__gemini_function_call_thought_signatures__": {}
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 88,
          "completionTokens": 7,
          "totalTokens": 95
        },
        "finishReason": "STOP",
        "index": 0
      },
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 88,
        "output_tokens": 7,
        "total_tokens": 95
      }
    }
  ]
}
*/
