import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Annotation, START } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import "dotenv/config";

const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const add = new DynamicStructuredTool({
    name: "add",
    description: "Useful for adding two numbers",
    schema,
    func: async ({ a, b }) => a + b,
});

const subtract = new DynamicStructuredTool({
    name: "subtract",
    description: "Useful for subtracting two numbers",
    schema,
    func: async ({ a, b }) => a - b,
});

const multiply = new DynamicStructuredTool({
    name: "multiply",
    description: "Useful for multiplying two numbers",
    schema,
    func: async ({ a, b }) => a * b,
});

const divide = new DynamicStructuredTool({
    name: "divide",
    description: "Useful for dividing two numbers",
    schema,
    func: async ({ a, b }) => a / b,
});

const tools = [add, subtract, multiply, divide]; 

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const llm_with_tool = llm.bindTools(tools); 

const graphState = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(graphState);

const toolNode = new ToolNode(tools); 

async function chatNode(state) {
    const res = await llm_with_tool.invoke(state.messages);
    return { messages: [res] };
}

graph.addNode("agent", chatNode);
graph.addNode("tools", toolNode); 

graph.addEdge(START, "agent");
graph.addConditionalEdges("agent", toolsCondition);

const workflow = graph.compile();

const initialState = {
    messages: [new HumanMessage("What is 2 + 2?")],
};

const res = await workflow.invoke(initialState);
console.log(res);

/*
{
  messages: [
    HumanMessage {
      "content": "What is 2 + 2?",
      "additional_kwargs": {},
      "response_metadata": {}
    },
    AIMessage {
      "content": [
        {
          "type": "functionCall",
          "functionCall": {
            "name": "add",
            "args": "[Object]"
          }
        }
      ],
      "additional_kwargs": {
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s).",
        "__gemini_function_call_thought_signatures__": {
          "528b2b93-d8a9-44d5-9123-a2df6f54006a": "CqoCAXLI2nyo/PvsWXrd1MsL/6BtxDQA/MCK18Wr8Byhyp7IEPBBZNep71Eo15dnhmpFPKRKV2/cVpsMc/Vx1WvjWabqkLcpsouc0SQaDBNQwbMCxFd1yVaI3aTuJGl8KytMfQyd7OrCrMKIPqTPOEeERanZagtQlAd7HHPhYjj5CJaIqVsxJ3Two0Bj0rOiO7PDRoXxFdJgmkA4iQGjLhNIJi6it525HMRlbnrVQnIc0oc26w1TLIP9F1Y+FBKmTXezvKkkPOKlundBjzTm6R6ldTkVi5wvmvC1FKHsxYDgRDMbaLahta8fpZaxuu0YBBJd4Xy2Sh0Sb/eBv4ifCGY8AMBIAqSZ9TCf4Ndx5Ndd1afLw2c065/2VzPOfrxiA6mR/AOZzsUH/HqTiQ=="
        }
      },
      "response_metadata": {
        "tokenUsage": {
          "promptTokens": 193,
          "completionTokens": 18,
          "totalTokens": 295
        },
        "finishReason": "STOP",
        "index": 0,
        "finishMessage": "Model generated function call(s)."
      },
      "tool_calls": [
        {
          "type": "tool_call",
          "id": "528b2b93-d8a9-44d5-9123-a2df6f54006a",
          "name": "add",
          "args": {
            "a": 2,
            "b": 2
          }
        }
      ],
      "invalid_tool_calls": [],
      "usage_metadata": {
        "input_tokens": 193,
        "output_tokens": 18,
        "total_tokens": 295
      }
    },
    ToolMessage {
      "content": "4",
      "name": "add",
      "additional_kwargs": {},
      "response_metadata": {},
      "tool_call_id": "528b2b93-d8a9-44d5-9123-a2df6f54006a"
    }
  ]
}
*/
