import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import "dotenv/config";

const graphState = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        reducer: (prev, next) => prev.concat(next),
        default: () => [],
    }),
});

const graph = new StateGraph(graphState);

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

async function chatNode(state) {
    const res = await llm.invoke(state.messages);
    return { messages: [res] };
}

graph.addNode("chat_node", chatNode);

graph.addEdge(START, "chat_node");
graph.addEdge("chat_node", END);

const workflow = graph.compile();

for await (const chunk of await workflow.stream({ messages: [new HumanMessage("explain langGraph in short")] }, { streamMode: "messages" })) {
    console.log(JSON.stringify(chunk));
}


// complete output
/*
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":"LangGraph is an extension of LangChain designed to build **stateful, multi-actor applications** using LLMs.\n\nThink of it as building a sophisticated **flowchart or state machine** for your AI.\n\nHere's the breakdown","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":":\n\n1.  **Graph Structure:** You define your application as a **graph** where:\n    *   **Nodes** are individual steps (e.g., call an LLM, use a tool, process data, make","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":" a decision).\n    *   **Edges** define the transitions between these nodes.\n2.  **State Management:** It maintains an **internal state** that evolves as the graph executes. This state is passed between nodes and can influence","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":" future transitions.\n3.  **Complex Workflows:** This stateful graph approach enables:\n    *   **Loops:** Repeating steps (e.g., retry until successful).\n    *   **Conditional Logic:** Branching based on previous","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":" results or the current state.\n    *   **Agents:** Building advanced agents that can deliberate, use tools, and interact over multiple turns, with explicit control over their thinking process.\n\nIn short, LangGraph provides a way to explicitly define and","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
[{"lc":1,"type":"constructor","id":["langchain_core","messages","AIMessageChunk"],"kwargs":{"content":" control the flow, memory, and decision-making logic of complex LLM applications, moving beyond simple chains to create robust, multi-step AI systems.","tool_calls":[],"invalid_tool_calls":[],"tool_call_chunks":[],"additional_kwargs":{},"response_metadata":{},"id":"run-019b6b0a-7e41-7000-8000-0951217d5765"}},{"tags":[],"langgraph_step":1,"langgraph_node":"chat_node","langgraph_triggers":["branch:to:chat_node"],"langgraph_path":["__pregel_pull","chat_node"],"langgraph_checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","__pregel_task_id":"207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","checkpoint_ns":"chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef","ls_provider":"google_genai","ls_model_name":"gemini-2.5-flash","ls_model_type":"chat"}]
*/

// single output instance 
/*
[
    {
        "lc": 1,
        "type": "constructor",
        "id": [
            "langchain_core",
            "messages",
            "AIMessageChunk"
        ],
        "kwargs": {
            "content": "LangGraph is an extension of LangChain designed to build **stateful, multi-actor applications** using LLMs.\n\nThink of it as building a sophisticated **flowchart or state machine** for your AI.\n\nHere's the breakdown",
            "tool_calls": [],
            "invalid_tool_calls": [],
            "tool_call_chunks": [],
            "additional_kwargs": {},
            "response_metadata": {},
            "id": "run-019b6b0a-7e41-7000-8000-0951217d5765"
        }
    },
    {
        "tags": [],
        "langgraph_step": 1,
        "langgraph_node": "chat_node",
        "langgraph_triggers": [
            "branch:to:chat_node"
        ],
        "langgraph_path": [
            "__pregel_pull",
            "chat_node"
        ],
        "langgraph_checkpoint_ns": "chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef",
        "__pregel_task_id": "207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef",
        "checkpoint_ns": "chat_node:207bec68-eb3d-57d5-9e2f-c6d1c2ab09ef",
        "ls_provider": "google_genai",
        "ls_model_name": "gemini-2.5-flash",
        "ls_model_type": "chat"
    }
]
*/