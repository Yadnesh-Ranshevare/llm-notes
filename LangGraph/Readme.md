# Content
1. [Introduction](#introduction)


---

# Introduction
LangGraph is a Python/JS library (from the LangChain ecosystem) used to build LLM-powered applications as graphs instead of simple chains.

It is designed specifically for multi-step, often multi-agent LLM applications where you need fine-grained control over flow, memory, and error handling.


In simple words:
- LangChain = linear flow (step → step)
- LangGraph = flowchart with loops, branches, and memory

LangGraph is an orchestration framework means it helps you coordinate, control, and manage multiple AI/LLM-related steps work together

### Core idea
LangGraph treats your AI app as a directed graph:
- Nodes are functions/agents that do work (call an LLM, query a DB, run tools, apply business logic, ask the user, etc.).
- Edges define which node runs next, including branching (if/else), loops, and retries.
- State (data) is a shared, persistent object that flows through the graph, letting agents read/update context across turns and sessions.

### Simple Illustration
Imagine a coding assistant agent:
```
       User Question
            ↓
        LLM Thinks
            ↓
     Is answer complete?
     ↙              ↘
   NO                 YES
   ↓                   ↓
Search Docs        Return Answer
   ↓
LLM Thinks again
```
This loop + decision is hard in plain LangChain but natural in LangGraph.

This graph like structure is what we called `workflow`
> An LLM workflow is the step-by-step pipeline that defines how data moves through an AI system, including when the LLM is called, how its output is processed, and what happens next.
### How memory works in LangGraph
LangGraph treats “memory” as explicit, persistent state plus optional long‑term JSON memories and checkpoints.

 LangGraph’s memory is tightly integrated with its graph runtime and thread IDs.

For details:
- **Shared state object:** Every graph has a state that all nodes read and write, so conversation history, tool results, and metadata live in one structured object.
- **Checkpointing per thread:** A checkpointer (e.g., database-backed saver) persists the full state at each step, letting you resume, replay, or fork conversations and workflows.
- **Long‑term memory store:** LangGraph can store “memories” as JSON documents, and recall them across threads and sessions.

#### How memory works in LangChain
- **Multiple memory types:** vector-backed VectorStoreRetrieverMemory for longer-term recall from a vector DB like Chroma or Pinecone
- **Attached per chain/agent:** Each chain or agent gets its own memory, and that memory only remembers things for that specific chain/agent — not others.
- You explicitly give memory to a chain/agent, It’s not automatic or shared unless you do it intentionally

### LangGraph is stateful whereas LangChain is stateless.
> state = stored data that changes over time.

LangGraph remembers and updates state across steps automatically, while LangChain treats each step as mostly independent unless you manually pass memory.

#### In LangChain
- Each chain step runs without built-in awareness of previous steps
- You must manually inject memory
- Flow is linear
- No natural loops or branching

Illustration
```py
step1_output = llm(prompt1)
step2_output = llm(step1_output)
```
#### In LangGraph
- LangGraph introduces a shared STATE object.
- Every node:
    - Reads from state
    - Writes back to state
- State persists across nodes, branches, and loops

Illustration (mental model)
```
STATE = {
  input,
  messages,
  tools_used,
  decisions
}
```

### Async Behavior of LangGraph
LangGraph can stop execution, save its state, and resume later from the same point.
> LangChain usually runs start → finish in one go.

#### LangGraph: Pause + Resume (Checkpointing)
LangGraph supports execution checkpoints.
1. Run node A
2. Update state
3. Save state
4. Stop
5. Later → resume from next node
    - After user input
    - After an external event
    - After approval\
    ect...

#### LangChain: No natural pause
How LangChain runs
```
Input → Step1 → Step2 → Step3 → Output
```
- Once started, it executes continuously
- If it stops → it ends
- To “resume”, you must:
    - Re-run the chain
    - Manually reconstruct context

#### Why LangGraph can do this
- It has a central state object
- Nodes are independent execution units
- Execution is event-driven
- State is serializable

### LangChain vs LangGraph


| Dimension                  | LangChain                                      | LangGraph                                                                 |
|-----------------------------|------------------------------------------------|---------------------------------------------------------------------------|
| **Primary Role**           | Prompts, chains, tools, retrievers, basic agents. | Stateful graph orchestration for multi-agent workflows.  |
| **Core Abstraction**       | Linear chains/pipelines (LCEL: A → B → C). | Nodes, edges, routers with explicit shared state. |
| **Control Flow**           | Mostly linear; branching needs custom code. | Native branching, loops, retries, multi-agent routing.   |
| **State & Memory**         | Local memory classes per chain (chat history, vector stores). | Global thread-scoped state + checkpoints + JSON memories. |
| **Persistence**            | Optional/custom (add your own DB).    | Built-in checkpointing for resume/replay/forking.       |
| **Scope**                  | Per chain/agent instance.             | Whole workflow/thread across all nodes/agents.          |
| **Use Cases**              | Simple RAG, chatbots, one-shot tools.| Complex/multi-agent, long-running, dynamic flows. |
| **Relationship**           | Base library.                       | Built on LangChain; wraps components in nodes.           |
| **Learning Curve**         | Easier for prototypes.                | Better for production complexity.                        |
| **Best For**               | Predictable linear flows, prompt context mgmt. | Fine-grained control, observability, state sync.       |


[Go To Top](#content)

---
# Installation
1. initialize a node repo
```bash
npm init -y
```
2. install LangGraph
```bash
npm install @langchain/langgraph @langchain/core
```

[Go To Top](#content)

---
# How to construct Graphs

1. create the state schema
```js
import {z} from 'zod'

const GraphState = z.object({
    height:z.number(),
    weight:z.number(),
    bmi:z.number()
})
```
>This state is like a central dataset for the graph, whenever any node needs some data they get that via this state object and each node can update this state directly, to keep the data updated throughout the graph



2. initialize the graph using this schema
```js
import { StateGraph } from "@langchain/langgraph";

const graph = new StateGraph(GraphState)
```

#### After this our graph is ready with a central storage (state) and now we just need to add nodes and connect them by edges

### How to create Nodes
Nodes are the individual function that perform certain task

Each Node:
- accept the state object 
- if any node need any data they get it via this state object
- it can update this sate object if needed
- it also return the state object so it can pass it to next node

**Coding implementation for Node**

1. create a function that accept the state of a graph
```js
function BMI(state){}   // state is pass by the previous node
```
2. access the state data
```js
function BMI(state){
    const height = state.height
    const weight = state.weight
    const bmi = weight/(height*height)  // calculating bmi
}
```
3. update the state
```js
function BMI(state){
    const height = state.height
    const weight = state.weight
    const bmi = weight/(height*height)

    const newState = {
        height,
        weight,
        bmi     // updating bmi value
    }
}
```
4. return the new state
```js
function BMI(state){
    const height = state.height
    const weight = state.weight
    const bmi = weight/(height*height)

    const newState = {
        height,
        weight,
        bmi
    }
    return newState
}
```
**Attach the Node to Graph**
```js
// syntax: .addNode("name_of_node", function to call)
graph.addNode("calculate_bmi",BMI)
```
### How to connect node using edges
syntax:
```js
.addEdge("fist_node","second_node")
```
LangGraph provide some inbuilt Nodes like:
- `START`: represent the start node of the graph
- `END`: represent the end node of the graph

**Coding Implementation**
```js
graph.addEdge(START,"calculate_bmi")
graph.addEdge("calculate_bmi",END)
```
Mental Model
```
START -> "calculate_bmi" -> END
```

#### Now our graph is finally ready node and edges are declared we just need to callable this into a workflow that can process input and return output
```js
const workflow = graph.compile();
```
`.compile()` method is used to finalize a graph definition into an executable graph.

When you call `.compile()`:
1. **Validates the graph**
    - Checks that all nodes exist
    - Ensures edges are valid
    - Confirms start/end nodes
2. **Freezes the structure**
    - No more nodes or edges can be added
    - Graph becomes immutable
3. **Creates a runnable executor**
    - Adds state management
    - Handles node transitions
    - Enables `.invoke()` / `.stream()` / `.batch()`

### Execute this graph
```js
const initialState = {
    height:1.8,
    weight:80
}
const res = await workflow.invoke(initialState)
```
each graph accept the initial state object that hold the initial info about the state (central storage) 

During the execution any Node inside that graph can update this state object, and we get the final state as a response at the end of the execution

### Complete code
```js
import { z } from "zod";
import { StateGraph, START, END } from "@langchain/langgraph";

const GraphState = z.object({
    height: z.number(),
    weight: z.number(),
    bmi: z.number(),
});

const graph = new StateGraph(GraphState);

function BMI(state) {
    const height = state.height;
    const weight = state.weight;
    const bmi = weight / (height * height);

    const newState = {
        height,
        weight,
        bmi,
    };
    return newState;
}

graph.addNode("calculate_bmi", BMI);

graph.addEdge(START, "calculate_bmi");

graph.addEdge("calculate_bmi", END);

const workflow = graph.compile();

const initialState = {
    height: 1.8,
    weight: 80,
};

const res = await workflow.invoke(initialState);

console.log(res);
```
output:
```js
{ height: 1.8, weight: 80, bmi: 24.691358024691358 }
```

[Go To Top](#content)

---
