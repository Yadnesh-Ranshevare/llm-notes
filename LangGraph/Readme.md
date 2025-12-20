# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [How to construct Graphs](#how-to-construct-graphs)
4. [Prompt Chaining / Sequential Workflow](#prompt-chaining-workflow)
5. [Parallel Workflow](#parallel-workflow)

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
- it also return the state object (original / updated) so it can pass it to next node

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

#### Now our graph is finally ready, node and edges are declared. We just need to callable this into a workflow that can process input and return output
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
each graph accept the initial state object that hold the initial info about the state (central storage) before the execution started

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
# Prompt Chaining Workflow

Prompt chaining means breaking a complex task into multiple LLM steps, where the output of one prompt becomes the input to the next.

### Example:
Let say you have to write a blog on a certain topic, for which you are using LLM. But instead of writing a blog in one single go you:
1. first give your topic to LLM  
2. generate a detail outline for the blog
3. on the bases of this outline you write a actual blog using LLM

Mental Model
```
START -> 'LLM generate outlie' -> 'LLM write a blog based on outline' -> END
```

### Coding Implementation
1. create a graph
```js
import { StateGraph } from "@langchain/langgraph"
import {z} from "zod"

const GraphState = z.object({
    topic: z.string(),  
    outline: z.string(),
    blog: z.string(),
})

const graph = new StateGraph(GraphState);
```
2. initialize a LLM
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config"

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});
```
3. Declare nodes
```js
async function GenerateOutline(state){
    const outline = await llm.invoke(`Generate an outline for a blog post about ${state.topic}.`);  // get the topic from state
    state.outline = outline.content // save the outline into the state
    return state
}

graph.addNode("generate_outline", GenerateOutline);

async function GenerateBlog(state){
    const blog = await llm.invoke(`Generate a blog post about ${state.topic} with the outline ${state.outline}.`);      // get the topic and outline from state
    state.blog = blog.content   // save the blog into the state
    return state
}

graph.addNode("generate_blog", GenerateBlog);
```
4. connect the edges
```js
graph.addEdge(START, "generate_outline");
graph.addEdge("generate_outline", "generate_blog");
graph.addEdge("generate_blog", END);
```
mental model
```
START -> "generate_outline" -> "generate_blog" -> END
```
5. compile the graph into the workflow 
```js
const workflow = graph.compile();
```
6. invoke the compiled workflow
```js
const initialState = {
    topic: "AI",
};

const res = await workflow.invoke(initialState);
```

### Complete code
```js
import "dotenv/config"
import { StateGraph, START, END } from "@langchain/langgraph"
import {z} from "zod"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const GraphState = z.object({
    topic: z.string(),
    outline: z.string(),
    blog: z.string(),
})

const graph = new StateGraph(GraphState);

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

async function GenerateOutline(state){
    const outline = await llm.invoke(`Generate an outline for a blog post about ${state.topic}.`);
    state.outline = outline.content
    return state
}

graph.addNode("generate_outline", GenerateOutline);

async function GenerateBlog(state){
    const blog = await llm.invoke(`Generate a blog post about ${state.topic} with the outline ${state.outline}.`);
    state.blog = blog.content
    return state
}

graph.addNode("generate_blog", GenerateBlog);

graph.addEdge(START, "generate_outline");
graph.addEdge("generate_outline", "generate_blog");
graph.addEdge("generate_blog", END);

const workflow = graph.compile();

const initialState = {
    topic: "AI",
};

const res = await workflow.invoke(initialState);

console.log(res);
```
Output:
> visit the [source code](./src/Sequential/PromptChaining.js) to see the complete output
```js
{
  topic: 'AI',
  outline: "Here's a comprehensive outline for a blog post about AI, designed to be informative, engaging, and accessible to a general audience.\n" +
    '\n' +
    '---\n' +
    '\n' +
    .
    .
    .
    '*   Machine Learning\n' +
    '*   Deep Learning',
  blog: '## Unlocking the World of AI: Your Essential Guide\n' +
    '\n' +
    'Forget the menacing robots of sci-fi films for a moment. While those make for thrilling cinema, the reality of Artificial Intelligence (AI) is far more integrated into our daily lives – and often much more subtle. From the moment your smartphone suggests the next word in your text, to the personalized recommendations popping up on your streaming service, AI is silently shaping our world.\n' +
    '\n' +
    .
    .
    .
    "### The Road Ahead: What's Next for AI?\n" +
    '\n' +
    "The journey of AI is far from over. We can expect AI to become even more seamlessly integrated into every facet of our lives, transforming industries and personal experiences in ways we're just beginning to imagine. Research into Artificial General Intelligence (AGI) will co"... 1746 more characters
}
```

[Go To Top](#content)

---
# Parallel Workflow
A parallel workflow is a workflow where multiple tasks run at the same time instead of one after another, as long as they don’t depend on each other.

> Sequential workflow → Task A → Task B → Task C
>
>Parallel workflow → Task A and Task B and Task C run together

### Example:
let say we have a data of a batsman from a single match, and we want to calculate hit Stick rate, boundary percentage, and balls per boundary

where:
- strick rate = $\frac{Runs\ Scored}{Ball\ faced} \times 100$
- balls per boundary = $\frac{Ball\ Faced}{\text{no. of fours + no. of six} }$

- boundary percentage = $\frac{\text{}Runs from Boundaries}{\text{Total Runs Scored}} \times 100$

as we can see Stick rate, boundary percentage, and balls per boundary are independent of each other i.e, they doesn't need each other to compute them self
 
therefor we can use parallel workflow for this problem statement

```
        ┌───> calculate_Strick_Rate ───────────┐
        │                                      │ 
START ──┼───> calculate_Boundary_Percentage ───┼───> generate_summary ──> END 
        │                                      │ 
        └───> calculate_balls_per_boundary ────┘
```

### Coding Implementation
1. initialize a Graph
```js
import { StateGraph } from "@langchain/langgraph";

const GraphState = z.object({
    fours: z.number(),
    sixes: z.number(),
    totalRuns: z.number(),
    ballFaced:z.number(),
    boundaryPercentage: z.number(),
    strickRate: z.number(),
    ballsPerBoundary: z.number(),
    summary: z.string()
})

const graph = new StateGraph(GraphState);
```
2. Create Nodes
```js

function calculateStrickRate(state){
    state.strickRate = (state.totalRuns/state.ballFaced)*100
    return state
}
graph.addNode("calculate_Strick_Rate", calculateStrickRate)


function calculateBoundaryPercentage(state){
    const four = state.fours * 4    // runs scored by 4's
    const six = state.sixes * 6     // run scored by 6's
    state.boundaryPercentage = ((fourRuns + sixRuns) / state.totalRuns ) * 100
    return state
}
graph.addNode("calculate_Boundary_Percentage", calculateBoundaryPercentage)


function calculateBallsPerBoundary(state){
    state.ballsPerBoundary = (state.ballFaced / (state.fours + state.sixes))
    return state
}
graph.addNode("calculate_balls_per_boundary", calculateBallsPerBoundary)


function generateSummary(state){
    state.summary = `strick Rate = ${state.strickRate} \nboundary percentage = ${state.boundaryPercentage} \n balls per boundary =  ${state.ballsPerBoundary}`
    return state
}
graph.addNode("generate_summary", generateSummary)
```
3. Connect the edges
```js
graph.addEdge(START, "calculate_Strick_Rate")
graph.addEdge(START, "calculate_Boundary_Percentage")
graph.addEdge(START, "calculate_balls_per_boundary")

graph.addEdge("calculate_Strick_Rate", "generate_summary")
graph.addEdge("calculate_Boundary_Percentage", "generate_summary")
graph.addEdge("calculate_balls_per_boundary", "generate_summary")

graph.addEdge("generate_summary", END)
```
Mental Model:
```
        ┌───> calculate_Strick_Rate ───────────┐
        │                                      │ 
START ──┼───> calculate_Boundary_Percentage ───┼───> generate_summary ──> END 
        │                                      │ 
        └───> calculate_balls_per_boundary ────┘
```
4. compile the graph
```js
const workflow = graph.compile()
```

#### After this are workflow is ready to take input but instead of returning final state it will throw an error at run time
```js
const initialState = {
    fours: 4,
    sixes: 2,
    totalRuns: 80,
    ballFaced:100,
}

const finalState = await workflow.invoke(initialState)
```
output:
```
InvalidUpdateError: Invalid update for channel "fours" with values [4,4]: LastValue can only receive one value per step.
```
### Why this error occur

If you look at our workflow there are three nodes all start from `START`:
```js
graph.addEdge(START, "calculate_Strick_Rate")
graph.addEdge(START, "calculate_Boundary_Percentage")
graph.addEdge(START, "calculate_balls_per_boundary")
```
mental model:
```
        ┌───> calculate_Strick_Rate 
        │                                     
START ──┼───> calculate_Boundary_Percentage 
        │                                      
        └───> calculate_balls_per_boundary
```
Each of those nodes returns the entire `state` object:
```js
return state
```
That means each node writes ALL fields, including:
```js
fours: 4
sixes: 2
```
So langGraph think we are updating same `state` value from multiple nodes at the same time since they are running parallelly 
> Even though the value is the same, two writes = illegal.

Now focus this error line:\
`LastValue can only receive one value per step`

In LangGraph:
- Each state field (like `fours`, `sixes`, etc.) is a channel
- By default, every channel is a LastValue channel
- A LastValue channel can only be written once per step

since we are in parallel execution langGraph see updates in One single step
```
fours ← 4   (from node A)
fours ← 4   (from node B)
```
Therefor we get `InvalidUpdateError` error saying:
```
InvalidUpdateError: Invalid update for channel "fours" with values [4,4]: LastValue can only receive one value per step.
```
### To solve this error we return partial state updates

Each node should return only what it computes, not the whole state.

#### EXample:
Strike rate node
```js
function calculateStrickRate(state) {
  return {  // only pass the part of the sate that has been updated
    strickRate: (state.totalRuns / state.ballFaced) * 100
  }
}
```
Boundary percentage node
```js
function calculateBoundaryPercentage(state) {
  const fourRuns = state.fours * 4
  const sixRuns = state.sixes * 6

  return {
    boundaryPercentage: ((fourRuns + sixRuns) / state.totalRuns ) * 100
  }
}
```
Balls per boundary node
```js
function calculateBallsPerBoundary(state) {
  return {
    ballsPerBoundary: state.ballFaced / (state.fours + state.sixes)
  }
}
```

### Final code
```js
import { StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const GraphState = z.object({
    fours: z.number(),
    sixes: z.number(),
    totalRuns: z.number(),
    ballFaced: z.number(),
    boundaryPercentage: z.number(),
    strickRate: z.number(),
    ballsPerBoundary: z.number(),
    summary: z.string(),
});

const graph = new StateGraph(GraphState);

function calculateStrickRate(state) {
    return {
        strickRate: (state.totalRuns / state.ballFaced) * 100,
    };
}

graph.addNode("calculate_Strick_Rate", calculateStrickRate);

function calculateBoundaryPercentage(state) {
    const fourRuns = state.fours * 4;
    const sixRuns = state.sixes * 6;

    return {
        boundaryPercentage: ((fourRuns + sixRuns) / state.totalRuns ) * 100,
    };
}

graph.addNode("calculate_Boundary_Percentage", calculateBoundaryPercentage);

function calculateBallsPerBoundary(state) {
    return {
        ballsPerBoundary: state.ballFaced / (state.fours + state.sixes),
    };
}

graph.addNode("calculate_balls_per_boundary", calculateBallsPerBoundary);

function generateSummary(state) {
    state.summary = `strick Rate = ${state.strickRate} \nboundary percentage = ${state.boundaryPercentage} \n balls per boundary =  ${state.ballsPerBoundary}`;
    return state;
}

graph.addNode("generate_summary", generateSummary);

graph.addEdge(START, "calculate_Strick_Rate");
graph.addEdge(START, "calculate_Boundary_Percentage");
graph.addEdge(START, "calculate_balls_per_boundary");

graph.addEdge("calculate_Strick_Rate", "generate_summary");
graph.addEdge("calculate_Boundary_Percentage", "generate_summary");
graph.addEdge("calculate_balls_per_boundary", "generate_summary");

graph.addEdge("generate_summary", END);

const workflow = graph.compile();

const initialState = {
    fours: 4,
    sixes: 2,
    totalRuns: 80,
    ballFaced: 100,
};

const finalState = await workflow.invoke(initialState);
console.log(finalState);
```
Output:
```js
{
  fours: 4,
  sixes: 2,
  totalRuns: 80,
  ballFaced: 100,
  boundaryPercentage: 35,
  strickRate: 80,
  ballsPerBoundary: 16.666666666666668,
  summary: 'strick Rate = 80 \n' +
    'boundary percentage = 35 \n' +
    ' balls per boundary =  16.666666666666668'
}
```

[Go To Top](#content)

---
