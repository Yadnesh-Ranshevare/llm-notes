import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, DynamicStructuredTool } from "langchain";
import { z } from "zod";

const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const addTool = new DynamicStructuredTool({
    name: "add_numbers",
    description: "Useful for adding numbers",
    schema,
    func: async ({ a, b }) => {
        return a + b;
    },
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Useful for multiplying numbers",
    schema,
    func: async ({ a, b }) => {
        return a * b;
    },
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const agent = createAgent({
    model: llm,
    tools: [addTool, multiplyTool]
});

const result = await agent.invoke({ messages: [{ role: "user", content: "first add 5 and 10 them multiply their sum by 2" }] });

console.log(result);

/*
{
  messages: [
    HumanMessage {
      "id": "c8638076-ca89-4a4c-a619-ed9712d2887e",
      "content": "first add 5 and 10 them multiply their sum by 2",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "id": "f30bbaad-f783-4889-b96c-0a1e15451489",
      "content": [
        {
          "type": "functionCall",
          "functionCall": {
            "name": "add_numbers",
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
          "e2716cc2-2c19-42eb-abbd-3631d87c26e6": "CsQCAXLI2nwjkDWx2rc0yJv4azvyyZ2FtVD89SnP/8CS18FiAhqpWfwpzfnsLuVFVphjePKHwRG51o6UPVi3SUqSZ76CMssDw8oo/c4swMXPvl8HuGGwbUJv9GyB+EDwPTtKh/IyJxR3uOVrH6CK1QzrO4ZHUoK0ZzCPUFQuKKsglKtDMgY9DMh1hM7lustFMPI6A4alQw2+vjutmYvFuSiKaGf3ygsHDFEQjnNO/OJh+vRnCpOoxJ8iMXZfvmVopetaSlCkRONyiQ2Pe3D7aP8oyqvr4p+os0vMV2iikipywQA4kSZ9CCizBOx1rtCwbC/m25A94zytOB/KH/uCOsIYk3KttiJrZm8nGgu7lXCv/SYqGK2+vHPIW9zKyBIjyOYzWpOpLYjH7Uun9zidiewiRq1bF7mwdqSpgI6qoQrPC2dHMrVs"
        }
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 110,
          "completionTokens": 21,
          "totalTokens": 226
        },
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s)."
      },
      "tool_calls": [
        {
          "type": "tool_call",
          "id": "e2716cc2-2c19-42eb-abbd-3631d87c26e6",
          "name": "add_numbers",
          "args": {
            "b": 10,
            "a": 5
          }
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 110,
        "output_tokens": 21,
        "total_tokens": 226
      }
    },
    ToolMessage {
      "id": "6e45978a-4e61-49fd-9648-ccc1a7d9943b",
      "content": "15",
      "name": "add_numbers",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "e2716cc2-2c19-42eb-abbd-3631d87c26e6"
    },
    AIMessage {
      "id": "864b37e0-b79b-46af-b9cf-1c180947b28a",
      "content": [
        {
          "type": "functionCall",
          "functionCall": {
            "name": "multiply_numbers",
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
          "1e4379f4-a650-43e6-a526-17293763c702": "CsgBAXLI2nyZN/sXmGUNryD0gEAYbqJdygOkE6JSXqkgs/mnzxXeexghahL1PlfKLwXO2Wt9PEo8oqtNXGxu/TobaMjOfOgUKlGJEkQuVUpww/7NVautyeq9bu1pVKaO/sGuAhLO/YkQ86YXEt1m7prHte5Jw8vIoyaEGfUAEFyFmZKH0tZ7VKGOOjJbKsBfS7aO+MBsr1Xkk9/f1iugupuL/4GLWO+cjJF5I/tnJjlhmsSvj+I8UtTWBHu6Ecg9qudEbFv7eBnpyio="
        }
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 147,
          "completionTokens": 21,
          "totalTokens": 228
        },
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s)."
      },
      "tool_calls": [
        {
          "type": "tool_call",
          "id": "1e4379f4-a650-43e6-a526-17293763c702",
          "name": "multiply_numbers",
          "args": {
            "a": 15,
            "b": 2
          }
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 147,
        "output_tokens": 21,
        "total_tokens": 228
      }
    },
    ToolMessage {
      "id": "252053fa-f8ae-4673-848a-4b220b30567c",
      "content": "30",
      "name": "multiply_numbers",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "1e4379f4-a650-43e6-a526-17293763c702"
    },
    AIMessage {
      "id": "202372df-c373-4bde-9340-990d5f03f0c3",
      "content": "The answer is 30.",
      "name": "model",
      "additional_kwargs": {
        "finishReason": "STOP",
        "index": 0,
        "__gemini_function_call_thought_signatures__": {}
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
      "additional_kwargs": {
        "finishReason": "STOP",
        "index": 0,
        "__gemini_function_call_thought_signatures__": {}
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
        "finishReason": "STOP",
        "index": 0,
        "__gemini_function_call_thought_signatures__": {}
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
        "__gemini_function_call_thought_signatures__": {}
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
        "tokenUsage": {
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
          "promptTokens": 184,
          "completionTokens": 7,
          "totalTokens": 247
        },
        "finishReason": "STOP",
          "totalTokens": 247
        },
        "finishReason": "STOP",
        },
        "finishReason": "STOP",
        "index": 0
        "finishReason": "STOP",
        "index": 0
      },
        "index": 0
      },
      },
      "tool_calls": [],
      "tool_calls": [],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 184,
        "output_tokens": 7,
        "total_tokens": 247
      }
    }
  ]
}
*/