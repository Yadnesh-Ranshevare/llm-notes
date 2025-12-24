# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [How to construct Graphs](#how-to-construct-graphs)
4. [Prompt Chaining / Sequential Workflow](#prompt-chaining-workflow)
5. [Parallel Workflow](#parallel-workflow)
6. [Annotation](#annotation)
7. [Conditional Workflow](#conditional-workflow)
8. [Iterative Workflow](#iterative-workflow)
9. [Persistence, checkpoint & Fault Tolerance](#persistence-checkpoint--fault-tolerance)
10. [Sqlite CheckPointer](#sqlite-checkpointer)
11. [Tools/ToolNode](#toolstoolnode)
12. [Human In The Loop (HITL)](#human-in-the-loop-hitl)

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
import { START, END } from "@langchain/langgraph";

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
import { START, END } from "@langchain/langgraph";

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
import { START, END } from "@langchain/langgraph";

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

# Annotation
In LangGraph, an Annotation is used to define the state of the graph and to control how values are stored, merged, and updated as the graph runs.

Think of it like a typed state field with rules for how data flows between nodes.

Annotation work alongside zod, therefor use zod fo declaring schema and Annotation for updating

> although we can use zod to declare and validate the schema of the graph but we can not control how they update


#### Example 1: Simple state (string)
```js
import { Annotation } from "@langchain/langgraph";

const state = Annotation.Root({
    userInput: Annotation(),
})
```

#### Example 2: Combining with zod
```js
import { Annotation } from "@langchain/langgraph";
import { z } from "zod"

const state = Annotation.Root({
    userInput: Annotation({
        schema: z.string()
    }),
})
```


### Problem 
In the parallel workflow we saw the problem of of updating same state simultaneously through multiple nodes throws an error, to solve that error we use partial update method

But let's assume we have a list inside of state and we want to append the result of two node working parallelly into that list
```js
const schema = z.object({
    list: z.array(z.string()),
});

const graph = new StateGraph(schema);

function NodeA(state) {
    return {list:["NodeA"]};    // update schema.list
}

function NodeB(state) {
    return {list:["NodeB"]};    // update schema.list
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);

graph.addEdge(START, "NodeA");
graph.addEdge(START, "NodeB");
graph.addEdge("NodeB", END);
graph.addEdge("NodeA", END);
```
As you can see in above example even though we have use partial update method it still update same value at the same time, as a result it will through `InvalidUpdateError` error:
```
InvalidUpdateError: Invalid update for channel "list" with values [["NodeA"],["NodeB"]]: LastValue can only receive one value per step.
```

To solve this issue we can use Reducers

### Reducers
A reducer is just a function that decides how state should change when new data comes in.

Without reducer (overwrite)
```js
let messages = [];
messages = ["Hi"];
messages = ["Hello"]; // ❌ old data lost
```

With reducer (append)
```js
const reducer = (prev, next) => prev.concat(next);

let messages = [];
messages = reducer(messages, ["Hi"]);
messages = reducer(messages, ["Hello"]);

console.log(messages);
// ["Hi", "Hello"]
```

LangGraph reducer example
```js
const messages = Annotation({
  reducer: (prev, next) => prev.concat(next),
  default: () => [],
});
```
- `prev` → Old state value
- `next` → value returned by a node 
- Result → new state value

Example:
```js
console.log(state.message)  // ['message']

state.message = ["new message"] // prev = ['message'] & next = ["new message"] & result = ['message', "new message"]
```


### How Reducer works In LangGraph
lets take a sequential execution
```
START -> Node A -> Node B -> END
```
without reducer
```js
const schema = z.object({
    list: z.array(z.string()),
});

const graph = new StateGraph(schema);

function NodeA(state) {
    return {list:["NodeA"]};   // update state -> list = ["NodeA"]
}

function NodeB(state) {
    return {list:["NodeB"]};    // update state -> list = ["NodeB"] -> overwrite
}
```
with reducer
```js
const schema = Annotation.Root({
    list: Annotation({
        schema: z.array(z.string()),
        default: () => [],
        reducer: (prev, next) => prev.concat(next), // reducer function that append the value into the list
    }),
})

const graph = new StateGraph(schema);

function NodeA(state) {
    return {list:["NodeA"]};   // update state -> list = ["NodeA"]
}

function NodeB(state) {
    return {list:["NodeB"]};    // update state -> list = ["NodeA", "NodeB"] -> Append
}
```


Node returns partial update
```js
return {
  list:["NodeB"],
};
```
LangGraph runs:
```js
state.list = reducer(state.list, ["NodeB"]);
```
### How Reducers solves the parallel workflow problem
In the previous example we see that the problem is because of simultaneous rewriting of same state variable through parallel executing nodes

Therefor to solve it instead of rewriting we have to updated them safely using reducers
```js
const schema = Annotation.Root({
    list: Annotation({
        schema: z.array(z.string()),
        default: () => [],
        reducer: (prev, next) => prev.concat(next), // reducer function that append the value into the list
    }),
})

const graph = new StateGraph(schema);

function NodeA(state) {
    return {list:["NodeA"]};    // call the reducer to append "NodeA"
}

function NodeB(state) {
    return {list:["NodeB"]};    // call the reducer to append "NodeB"
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);

graph.addEdge(START, "NodeA");
graph.addEdge(START, "NodeB");
graph.addEdge("NodeB", END);
graph.addEdge("NodeA", END);
```
This way you prevent rewriting the complete state variable by just appending the new value into original one

[Go To Top](#content)

---
# Conditional Workflow
A conditional workflow is a workflow where the next step depends on a condition (a decision or rule).
> If something happens, do this; otherwise, do something else.

think of it like using if / else logic to control the flow of steps.

```
           Start
             |
        Is condition true?
           /     \
        Yes       No
        |          |
     Action A   Action B
```

### Example: Roots of the quadratic equation
To find the root of any given quadratic equation $ax^2 + bx + c = 0$ we first need to find its determinant 

Formula of Determinant:

$$Determinant =  b^2 - 4ac$$

Formula of roots:

$$Roots = \frac{-b \pm \sqrt{Determinant}}{2a}$$

now based on this determinant value we have three possible solutions
1. determinant > 0 -> 2 real solution

$$r1 = \frac{-b + \sqrt{Determinant}}{2a}$$

$$r2 = \frac{-b - \sqrt{Determinant}}{2a}$$

2. determinant = 0 -> 1 repeated solution

$$r = \frac{-b }{2a}_{--------}(Determinant = 0)$$

3. determinant < 0 -> no real solution

### Workflow
```
                      START
                        │
                        ▼
            Show equation (ax^2 + bX + c = 0)
                        │
                        ▼
               Compute D = b² - 4ac
                        │
           ┌────────────┼────────────┐
           │            │            │
        D > 0         D = 0         D < 0
           │            │            │
           ▼            ▼            ▼
 Two real & distinct  Two real &    No real
     roots           equal roots     roots
  x₁, x₂ =           x = -b / 2a    (complex)
 (-b ± √D)/2a           |
        └───────────────┼───────────────┘
                        ▼
                       END
```
### How to implement Conditional routing
this conditional routing is not depend on the node, it is totally depend on how edges are connected with each other

we use a `.addConditionalEdges()` method to implement this conditional routing

Syntax
```
.addConditionalEdges("starting_node", routing_function)
```

`routing_function` its a special type of function that accept the `state` as input and return the next node based on a condition

Example:
```js
function routing_function(state){   // you can use any name you want
    if(condition){
        return "Node_A"
    }else{
        return "Node_B"
    }
}

graph.addConditionalEdges("starting_node", routing_function)
```
mental model
```
           starting_node
               |
        Is condition true?
           /     \
        Yes       No
        |          |
     Node A     Node B
```

### Coding Implementation
1. initialize a graph
```js
import { StateGraph } from "@langchain/langgraph";
import { z } from "zod";

const GraphState = z.object({
    a:z.number(),
    b:z.number(),
    c:z.number(),

    equation:z.string(),
    discriminant:z.number(),
    result:z.string(),
});

const graph = new StateGraph(GraphState);
```
2. declare a nodes
```js
function ShowEquation(state){
    const equation = state.a + "x^2 + " + state.b + "x + " + state.c + " = 0";
    return {equation:equation};
}
graph.addNode("show_equation", ShowEquation);

function calculateDiscriminant(state){
    const discriminant = (state.b * state.b) - (4 * state.a * state.c);
    return {discriminant:discriminant};
}
graph.addNode("calculate_discriminant", calculateDiscriminant);

function calculateRealRoots(state){
    const root1 = (-state.b + Math.sqrt(state.discriminant)) / (2 * state.a);
    const root2 = (-state.b - Math.sqrt(state.discriminant)) / (2 * state.a);
    return {result:`Root1 = ${root1} \nRoot2 = ${root2}`};
}
graph.addNode("calculate_real_roots", calculateRealRoots);

function calculateRepeatedRoot(state){
    const root = -state.b / (2 * state.a);
    return {result:`Root = ${root}`};
}
graph.addNode("calculate_repeated_root", calculateRepeatedRoot);

function calculateImaginaryRoots(state){
    return {result:"no real roots"};
}
graph.addNode("calculate_imaginary_roots", calculateImaginaryRoots);
```
3. connect the edges

```js
import { START, END } from "@langchain/langgraph";

function condition(state){
    if(state.discriminant > 0){
        return "calculate_real_roots";
    }else if(state.discriminant == 0){
        return "calculate_repeated_root";
    }else{
        return "calculate_imaginary_roots";
    }
}

graph.addEdge(START, "show_equation");
graph.addEdge("show_equation", "calculate_discriminant");

graph.addConditionalEdges("calculate_discriminant", condition);

graph.addEdge("calculate_real_roots", END);
graph.addEdge("calculate_repeated_root", END);
graph.addEdge("calculate_imaginary_roots", END);
```
Mental model
```
                      START
                        │
                        ▼
            Show equation (ax^2 + bX + c = 0)
                        │
                        ▼
               Compute D = b² - 4ac
                        │
           ┌────────────┼────────────┐
           │            │            │
        D > 0         D = 0         D < 0
           │            │            │
           ▼            ▼            ▼
       calculate_    calculate_    calculate_
         real_        repeated_    imaginary_
         roots          roots       roots
           └─────────────┼────────────┘
                         ▼
                        END
```
4. compile the graph into a workflow
```js
const workflow = graph.compile();
```
5. invoke the workflow
```js
const initialState = {
    a:4,
    b:10,
    c:6,
};

const finalState = await workflow.invoke(initialState);
```
### Complete code
[click here](./src/Conditional.js) to visit the complete code and its output

[Go To Top](#content)

---
# Iterative Workflow
An iterative workflow is a way of working where you build something in small steps, check the result, improve it, and repeat the process until the final solution is ready.

Instead of trying to finish everything at once, you loop through the same steps multiple times, refining the outcome each time.

> Build → Test → Get feedback → Improve → Repeat

### Example:
lets assume a system that generates a post using LLM, and uses another LLM to evaluate that AI generated post

second LLM will provide the feedback on the generated post, and based on that feedback we will decide whether to improve that post further or accept it 

```
           START
             |
             ▼
      Generate Post (LLM 1)
             |
             ▼
      Evaluate Post (LLM 2) <─────────────┐
             |                            |  
             ▼                            |
     Is Post Acceptable?                  |
          /         \                     |
       Yes           No                   |  
        |             |                   |
        ▼             ▼                   |  
   Accept Post   Perform OPtimization ────┘        
```

### Coding Implementation
1. initialize the LLM's
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import "dotenv/config";

const generator_llm = new ChatGoogleGenerativeAI({  // for generating the post
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const evaluator_llm = new ChatGoogleGenerativeAI({  // for evaluating the post
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const evaluation_schema = z.object({
    evaluation: z.enum(["good", "needs improvement"]),
    feedback: z.string(),
});

const structured_llm = evaluator_llm.withStructuredOutput(evaluation_schema)    // as we need output in structured format

const optimizer_llm = new ChatGoogleGenerativeAI({  // to perform optimization
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});
```
in above code snippet even though we have use same LLM models for each step, it is recommended that to use different LLM for different task 

**The idea is task specialization:** even if models come from the same family, different variants (or providers) are better at different jobs like creativity, evaluation, or cost-efficient iteration.

Examples:
- use `"models/gemini-2.5-pro"` when you want more creative & expressive behavior
- use `"models/gemini-2.5-flash"` when you want fast & logical behavior
- use `"models/gemini-2.0-flash-lite"` when you want cheaper & faster execution

2. initialize a graph
```js
import { StateGraph } from "@langchain/langgraph";
import { z } from "zod";

const GraphState = z.object({
    topic: z.string(),
    post: z.string(),
    evaluation: z.enum(["good", "needs improvement"]),
    feedback: z.string(),   // as we want to optimize the post based on feedback
    iteration: z.number(),  // to keep the count of iteration
    max_iterations: z.number(), // to avoid the case of infinite iteration
});

const graph = new StateGraph(GraphState);
```
3. declare the nodes
```js
async function generatePost(state) {
    const post = await generator_llm.invoke(`Generate a blog post on topic: ${state.topic}`);
    return { post: post.content };
}
graph.addNode("generate_post", generatePost);

async function evaluatePost(state){
    const prompt = `Evaluate the following blog post and tell whether to accept it or improve it along with proper feedback ${state.post}`
    const response = await structured_llm.invoke(prompt);   // generating a structured output
    return { evaluation: response.evaluation, feedback: response.feedback };
}
graph.addNode("evaluate_post", evaluatePost);

async function optimizePost(state){
    const prompt = 
    `improve the following post for topic ${state.topic} according to given feedback 
    POST:
    ${state.post}
    FEEDBACK:
    ${state.feedback}`

    const response = await optimizer_llm.invoke(prompt);
    return { post: response.content , iteration: state.iteration + 1 };
}
graph.addNode("optimize_post", optimizePost);
```
> Above prompt are too simple and will not wok properly use them only to understand how flow work, and perform proper prompt engineering for better results
4. connect the edges
```js
import { START, END } from "@langchain/langgraph";

function condition(state){
    if (state.evaluation === "needs improvement" && state.iteration < state.max_iterations){
        return "optimize_post";     // perform optimization
    } else {
        return END;     // accept the post
    }
}

graph.addEdge(START, "generate_post");
graph.addEdge("generate_post", "evaluate_post");

graph.addConditionalEdges("evaluate_post", condition);

graph.addEdge("optimize_post", "evaluate_post");    // looping back
```
mental Model

```
           START
             |
             ▼
      Generate Post (LLM 1)
             |
             ▼
      Evaluate Post (LLM 2) <─────────────┐
             |                            |  
             ▼                            |
     Is Post Acceptable?                  |
          /         \                     |
       Yes           No                   |  
        |             |                   |
        ▼             ▼                   |  
       END   Perform OPtimization ────────┘        
```
5. compile the graph into workflow and execute it
```js
const workflow = graph.compile();

const initialState = {
    topic: "AI",
    iteration: 1,
    max_iterations: 5,
};
const res = await workflow.invoke(initialState);
```

### Complete code
[click here](./src/Iterative.js) to see the final code with proper prompt engineering and its output



[Go To Top](#content)

---
# Persistence, checkpoint & Fault Tolerance
In original behavior of langGraph once we finish with the execution workflow it completely lost its state information, and if we re-execute the flow then we pass in new fresh state object 

### Example:
consider a chatbot workflow
```
START -> chat_node -> END
```
we pass our initial state as:
```js
const message = [
    new HumanMessage("hey my name is Yadnesh")
]
```
this message goes into LLM and it response accordingly and at the end we get our final state as:
```js
const message = [
    new HumanMessage("hey my name is Yadnesh"),
    new AIMessage("hey Yadnesh hwo can i help you?")
]
```
after this your first execution is completed, but you want to continue with the chatting so you re-execute the flow second time 

This time your new initial state will be:
```js
const message = [
    new HumanMessage("What is my name?")
]
```
since you pass the new fresh state second time it does not have any memory related to first its first execution therefor this time you get final state as follow:
```js
const message = [
    new HumanMessage("What is my name?"),
    new AIMessage("I don't have any personal info about you")
]
```
> one solution could be to pass the state of first execution along with second initial state but to do that you have to keep your code in continuously running state if it stop you lost the data

### Persistence
In persistence we solve this issue by storing the state of first execution into a external data storage

Persistence in LangGraph is a ability to save and restore the state of a workflow over time

Here we save the state of the previous execution into a external database then fetch it whenever we want to start next execution

In previous example when we get the final state of the first execution:
```js
const message = [
    new HumanMessage("hey my name is Yadnesh"),
    new AIMessage("hey Yadnesh hwo can i help you?")
]
```
we save it into the database, and when we about to start with our second execution we can fetch this info from the database and add it into the new initial state:
```js
const message = [
    new HumanMessage("hey my name is Yadnesh"), // from DB
    new AIMessage("hey Yadnesh hwo can i help you?"),   // from DB
    new HumanMessage("What is my name?")
]
```
now LLM can reply properly:
```js
const message = [
    new HumanMessage("hey my name is Yadnesh"), 
    new AIMessage("hey Yadnesh hwo can i help you?"),   
    new HumanMessage("What is my name?"),
    new AImessage("Your name is Yadnesh")
]
```
> This is useful in features like resume chat, where user want to continue their 3 to 4 (or even more) days older chat 

### Persistence also helps in checkPointing
Checkpoint means saving the current state of a workflow at specific points so it can continue later from the same point.

Checkpoint is usually use to save & pause you progress and resume it after some time

This is possible because LangGraph save state during each intermediate step instead of directly saving the final state only 

#### Example:
Consider a flow
```
START -> Node A -> Node B -> END
```
- your execution start with Node `START` with some initial state
- you came into the `Node A` update your state
- once you update you also save this updated state into the database
- `Node A's` execution is complete but `Node B` wants to delay it's execution because of some reason
- Therefor you stop the execution of your program 
- Since you already  save the result of `Node A` execution, you can directly start your execution from `Node B` instead of re-executing the whole flow
- Therefor we can say that we have create a checkpoint at `Node A` and we can pause and re-execute the flow from this checkpoint 

### Fault Tolerance
This checkpoint behavior of langGraph also act as fault tolerance

Fault tolerance means a system’s ability to keep working or recover automatically when something goes wrong.

Consider a flow
```
START -> Node A -> Node B -> END
```
- you start with node `START` goes to `Node A` 
- `Node A` successfully perform its execution and save its updated state into the database
- Now its time for `Node B's` execution, but for some reason `Node B's` execution crash
- In this scenario instead of going back and re-executing the flow from start, you just re-execute the `Node B` only, as we already have our progress save up till the `Node A` (checkpoint) into our database

### CheckPointers in LangGraph
CheckPointers in langGraph divide our workflow execution into a checkpoints, and during each checkpoint it save our state value
```
       START          → checkpoint #1
         ↓
       Node A         → checkpoint #2
    ┌────┴──────┐
    ↓           ↓
Node B        Node C  → checkpoint #3B & checkpoint #3C  
    └────┬──────┘
         ↓
       Node D         → checkpoint #4
         ↓
        END           → checkpoint #5
```
#### In code

```js
import { MemorySaver  } from "@langchain/langgraph";    // stores the state data into RAM 

const checkpointer = new MemorySaver();     // make sure to use same variable name i.e, 'checkpointer`

const workflow = graph.compile({checkpointer}); // LangGraph will handle the checkPointers
```
### Thread in LangGraph
A thread in LangGraph is a unique execution instance of a graph that holds its own state and checkpoints.


Consider a flow
```
START -> Node A -> Node B -> END
```
now you invoke this workflow twice with a different initial state
```js
const state1 = {
    steps: []
}
const state2 = {
    steps : ["random value"]
}

workflow.invoke(state1)
workflow.invoke(state2s)
```
Assume:
- Node A appends `"A"` into `state.steps`
- Node B appends `"B"` into `state.steps`

#### Invocation 1 (Thread-1)
```
START
  ↓
Node A → steps = ["A"]
  ↓
Node B → steps = ["A", "B"]
  ↓
END
```
#### Invocation 2 (Thread-2)
```
START
  ↓
Node A → steps = ["random value", "A"]
  ↓
Node B → steps = ["random value", "A", "B"]
  ↓
END
```
#### Thread IDs
we use `thread_id` to differentiate between different threads

Therefor if i want to re-execute my `Thread-2` i use `Thread-2` id to fetch it's state value and re-execute it

#### In Code
```js
const config = { configurable: { thread_id: "1" } };    // use any thread_id you want

await workflow.invoke(initialState, config);

const state = await workflow.getState(config);  // return the final save state data

const stateHistoryGenerator = workflow.getStateHistory(config)  // Generator That generate the intermediate state data 
```
### Coding Example 1: State Storage
```js
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";

const schema = z.object({
    Steps: z.array(z.string()),
});

const checkpointer = new MemorySaver(); // using in memory storage that store state data in RAM

const graph = new StateGraph(schema);

function NodeA(state) {
    state.Steps.push("NodeA");
    return state;
}

function NodeB(state) {
    state.Steps.push("NodeB");
    return state;
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);

graph.addEdge(START, "NodeA");
graph.addEdge("NodeA", "NodeB");
graph.addEdge("NodeB", END);

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };    // declaring thread_id = 1

const initialState = {
    Steps: [],
};

await workflow.invoke(initialState, config);    // running the workflow for threat_id = 1

console.log(await workflow.getState(config));   // return the stored state data

const stateHistory = workflow.getStateHistory(config) // generator

console.log(await stateHistory.next()); // state data before END node
console.log(await stateHistory.next()); // state data before NodeB node
console.log(await stateHistory.next()); // state data before NodeA node
console.log(await stateHistory.next()); // state data before START node
console.log(await stateHistory.next()); // end of generator
```
output:
```js
{
  values: { Steps: [ 'NodeA', 'NodeB' ] },
  next: [],
  tasks: [],
  metadata: { source: 'loop', step: 2, parents: {}, thread_id: '1' },
  config: {
    configurable: {
      thread_id: '1',
      checkpoint_id: '1f0de61a-2c0e-6570-8002-6adfc15bde3f',
      checkpoint_ns: ''
    }
  },
  createdAt: '2025-12-21T11:38:57.223Z',
  parentConfig: {
    configurable: {
      thread_id: '1',
      checkpoint_ns: '',
      checkpoint_id: '1f0de61a-2c07-6040-8001-5276f72a9140'
    }
  }
}
{
  value: {
    values: { Steps: [Array] },
    next: [],
    tasks: [],
    metadata: { source: 'loop', step: 2, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:38:57.223Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
{
  value: {
    values: { Steps: [Array] },
    next: [ 'NodeB' ],
    tasks: [ [Object] ],
    metadata: { source: 'loop', step: 1, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:38:57.220Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
{
  value: {
    values: { Steps: [] },
    next: [ 'NodeA' ],
    tasks: [ [Object] ],
    metadata: { source: 'loop', step: 0, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:38:57.212Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
{
  value: {
    values: {},
    next: [ '__start__' ],
    tasks: [ [Object] ],
    metadata: { source: 'input', step: -1, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:38:57.200Z',
    parentConfig: undefined
  },
  done: false
}
{ value: undefined, done: true }
```

### Coding Example 2: Fault Tolerance 
consider  workflow:
```
START -> Node A -> Node B -> Node C -> END
``` 
in our example we have simulate `Node B's` crashing as follows
```js
let attempt = 0;
async function NodeB(state) {
    if(attempt < 2) {
        attempt++;
        throw new Error("NodeB failed");
    }
    console.log("node B done");
    return {nodeB: true};
}
```
above code snippet will make the `Node B` crash twice before running successfully

therefor to see complete execution of the workflow we need to execute it three time
- first 2 will throw error at `Node B`
- Third time it will run successfully

to handle that error safely we use try-catch
```js
try {
    await workflow.invoke(initialState, config);    // will throw error
} catch (error) {
    console.error(error.message);
}

try {
    await workflow.invoke(undefined, config);   // will throw error
} catch (error) {
    console.error(error.message);
}

await workflow.invoke(undefined, config);   // run successfully
```
make sure to pass `undefined` as state input to so it can resume its execution from the last finish state data

#### Code
```js
import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";

const schema = z.object({
    nodeA: z.boolean().default(false),
    nodeB: z.boolean().default(false),
    nodeC: z.boolean().default(false),
});

const checkpointer = new MemorySaver();

const graph = new StateGraph(schema);

function NodeA(state) {
    console.log("node A done");
    return { nodeA: true };
}

let attempt = 0;
async function NodeB(state) {
    if (attempt < 2) {
        attempt++;
        throw new Error("NodeB failed");
    }
    console.log("node B done");
    return { nodeB: true };
}

function NodeC(state) {
    console.log("node C done");
    return { nodeC: true };
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);
graph.addNode("NodeC", NodeC);

graph.addEdge(START, "NodeA");
graph.addEdge("NodeA", "NodeB");
graph.addEdge("NodeB", "NodeC");
graph.addEdge("NodeC", END);

const workflow = graph.compile({ checkpointer });

const initialState = {
    nodeA: false,
    nodeB: false,
    nodeC: false,
};

const config = {
    configurable: {
        thread_id: "1",
    },
};

try {
    await workflow.invoke(initialState, config);
} catch (error) {
    console.error(error.message);
}
try {
    await workflow.invoke(undefined, config);
} catch (error) {
    console.error(error.message);
}
await workflow.invoke(undefined, config);
```
output:
```
node A done
NodeB failed
NodeB failed
node B done
node C done
```

### Coding Example 3: ChatBot Workflow 
through persistence we can make our chatbot remember chat history

```js
const GraphState = z.object({
    message:z.array(z.instanceof(BaseMessage))  // BaseMessage = AIMessage OR HumanMessage OR ToolMessage, ect
})

while (true) {  // chatting continuously until user stops
    let message = await rl.question("user: ");      // user message
    let chatHistory = await workflow.getState(config);  // fetching the chat history

    let state = { message: [] };

    if (chatHistory.values.message) {
        chatHistory.values.message.forEach((element) => {
            state.message.push(element);    // appending the chat history into state object
        });
    }
    state.message.push(new HumanMessage(message));  // appending the user message into the state
    const res = await workflow.invoke(state, config);   // calling the LLM with new state object that has chat history and users new message
    console.log(res.message[res.message.length - 1].content);
}
```
The above code is kind of hard to understand and debug, therefor in such cases we can use [Annotation](#annotation)
```js
const GraphState = Annotation.Root({
    message: Annotation({
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

while (true) {
    let message = await rl.question("user: ");
    const res = await workflow.invoke({ message: [new HumanMessage(message)] }, config);
    console.log(res.message[res.message.length - 1].content);
}
```
in above code even though we are passing initial state hardcoded. But since we have used `checkPointers` and `thread_id` langGraph will treat it as partial update, and just append the user new message in `state.message` while keeping the chat history stored

#### Code without Annotation reducer
```js
import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const checkpointer = new MemorySaver();

const GraphState = z.object({
    message:z.array(z.instanceof(BaseMessage))
})

const graph = new StateGraph(GraphState);

async function ChatBot(state) {
    const response = await llm.invoke(state.message);
    return {
        message: [...state.message, response],
    };
}

graph.addNode("ChatBot", ChatBot);
graph.addEdge(START, "ChatBot");
graph.addEdge("ChatBot", END);

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

const rl = readline.createInterface({ input, output });

while (true) {
    let message = await rl.question("user: ");
    let chatHistory = await workflow.getState(config);

    let state = { message: [] };

    if (chatHistory.values.message) {
        chatHistory.values.message.forEach((element) => {
            state.message.push(element);
        });
    }
    state.message.push(new HumanMessage(message));
    const res = await workflow.invoke(state, config);
    console.log(res.message[res.message.length - 1].content);
}
```
#### Code with Annotation Reducer
```js
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const checkpointer = new MemorySaver();

const GraphState = Annotation.Root({
    message: Annotation({
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(GraphState);

async function ChatBot(state) {
    const response = await llm.invoke(state.message);
    return {
        message: [response],
    };
}

graph.addNode("ChatBot", ChatBot);
graph.addEdge(START, "ChatBot");
graph.addEdge("ChatBot", END);

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

const rl = readline.createInterface({ input, output });

while (true) {
    let message = await rl.question("user: ");
    const res = await workflow.invoke({ message: [new HumanMessage(message)] }, config);
    console.log(res.message[res.message.length - 1].content);
}
```
#### output in both cases:
```
user: hey im yadnesh
Hi Yadnesh! Nice to meet you.

I'm an AI assistant. How can I help you today?
user: can you tell me my name
Your name is Yadnesh! You just told me. 😊
```


[Go To Top](#content)

---
# Sqlite CheckPointer
`MemorySaver` save the state value inside the RAM which is not ideal for actual storage system, also when we pause our program then our RAM get empty and we lost all of our stored data

Therefor it is not recommended to use `MemorySaver` in production application

**SqliteSaver**: An implementation of LangGraph checkpointer that uses SQLite database
>  Ideal for experimentation and local workflows, for production use `PostgresSaver`

### Installation
```bash
npm i better-sqlite3 @langchain/langgraph-checkpoint-sqlite
```
- `@langchain/langgraph-checkpoint-sqlite` -> langGraph sqliteSaver
- `better-sqlite3` -> sqlite database used by sqliteSaver

### Code
```js
import Database from "better-sqlite3"; 
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";

const db = new Database("checkpoints.db");  // provide the path for your database file
const checkpointer = new SqliteSaver(db);

const workflow = graph.compile({ checkpointer });
```
this will create the file name `checkpoints.db` in root of your project to store the state data

Whenever you perform:
```js
await workflow.getState(config)
```
it will return the data from this database

[Go To Top](#content)

---
# Tools/ToolNode
A ToolNode is a special LangGraph node whose only job is to execute tools that the LLM asks for.

>In langgraph we use ToolNode to execute the tool 

- Normally in langgraph you'd write a node function yourself, it takes in state and return state
- A ToolNode is a prebuilt node that knows how to handle a list of langchain tools
- its job is to listen for tool calls from LLM and automatically route the request to the correct tool, then pass the output back into the graph

### Tools_condition:
tools_condition is a prebuilt conditional edged function that helps your graph decide,\
"Should the flow go to ToolNode next, or back to the LLM"

### Coding Implementation
1. Create the Array of tools
```js
const tools = [add, subtract, multiply, divide];    // each value in this array is a Langchain tool
```
2. initiate a LLM and bind this tool with it
```js
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const llm_with_tool = llm.bindTools(tools);
```
3. Initiate a Graph
> make sure that it has `messages` parameter with is a type of `BaseMessage`
```js
import { BaseMessage } from "@langchain/core/messages";

const graphState = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    })
});

const graph = new StateGraph(graphState);
```
make sure to keep the spelling for `messages` same as langgraph internally use it like `state.messages` and we cannot change it unless we change the source code

lets assume you put `mess` instead `messages` then\
The error you'll get is like:
``` 
const message = Array.isArray(state) ? state[state.length - 1] : state.messages[state.messages.length - 1];
                                                                                               ^
TypeError: Cannot read properties of undefined (reading 'length')
```
as inside your state there is no `messages` parameter cause we have use `mess`
> This is because of langGraph tool_condition internal logic

4. create a ToolNode
```js
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode(tools);   // make sure to pass the array of tools from step 1
```
5. add Nodes
```js
graph.addNode("agent", chatNode);
graph.addNode("tools", toolNode);   // ToolNode created in step 4
```
6. connect the nodes by edges
```js
import { toolsCondition } from "@langchain/langgraph/prebuilt";

graph.addEdge(START, "agent");
graph.addConditionalEdges("agent", toolsCondition);
```
`toolsCondition` is a special type of inbuilt routing function that decide whether to pass the workflow to `ToolNode` or `END` 

my Flow
```
                   ┌─────> "tools" ─────┐
START ─> "agent" ──|                    |───> END 
                   └────────────────────┘
```

> The error and `messages` spelling restriction is because of this `toolCondition` internal logic

if you want to pass your `ToolMessage` back to LLM then:
```js
import { toolsCondition } from "@langchain/langgraph/prebuilt";

graph.addEdge(START, "agent");
graph.addConditionalEdges("agent", toolsCondition);
graph.addEdge("tools", "agent")
```
your Flow
``` 
            ┌───────────────┐
            ▼      ┌─────> "tools" 
START ─> "agent" ──|                   
                   └──────> END 
```
>There is no need to explicitly add `"agent"` to `"END"` edge as `toolsCondition` will handle it

7. invoke the graph
```js
const workflow = graph.compile();

const initialState = {
    messages: [new HumanMessage("What is 2 + 2?")],
};

const res = await workflow.invoke(initialState);
console.log(res);
```

### Complete Code
> [Click Here](./src/ToolNode.js) to check out complete code
```js
import { z } from "zod";
import { Annotation, START } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import {add, subtract, multiply, divide } from "./tools"    // visit complete code to check code related to tools
import llm from"./llm"

const tools = [add, subtract, multiply, divide]; 

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

graph.addNode("tools", toolNode); 

async function chatNode(state) {
    const res = await llm_with_tool.invoke(state.messages);
    return { messages: [res] };
}

graph.addNode("agent", chatNode);

graph.addEdge(START, "agent");
graph.addConditionalEdges("agent", toolsCondition);

const workflow = graph.compile();

const res = await workflow.invoke({messages: [new HumanMessage("What is 2 + 2?")]});
console.log(res);
```
Output:

```js
{
    messages:[
        HumanMessage {
            "content": "What is 2 + 2?",
            "additional_kwargs": {},
            "response_metadata": {}
        },
        AIMessage {
            "content": [{...}],
            "additional_kwargs": {...},
            "response_metadata": {...}
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
            "usage_metadata": {...}
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
```





[Go To Top](#content)

---
# Human In The Loop (HITL)
HITL is a design approach in AI systems where a human actively participate at critical points of the AI workflow, either to supervise, approve, correct or guide the model's output

Think of HITL as putting human "checkpoint" inside an AI pipeline so that important decision are not made autonomously by the model

### HITL ensures
- Accuracy
- safety
- Ethical Alignment
- Better user experience

### Common HITL pattern
- Action Approval pattern: Approve or reject before execution
- output review or edit pattern
- Ambiguity clarification Pattern
- Escalation Pattern: passing control to human if AI think he can't handle it

> HITL uses [checkPointer](#persistence-checkpoint--fault-tolerance) to keep the track of workflow execution. Therefor make sure to implement it along with checkPointer

### interrupt()
`interrupt()` is a LangGraph feature that lets you pause the graph execution at a specific point and wait for human input before continuing.

```
AI Node
   ↓
interrupt("Need human approval")
   ⏸️  ← execution stops here
   👤  ← human responds
   ▶️  ← execution resumes
   ↓
Next Node
```
Without interrupt:
- AI must block execution (input())
- Not scalable
- Not usable in web apps

With interrupt:
- Execution pauses
- State is saved
- Human responds later
- Execution resumes from same node

#### In LangGraph

```js
import { interrupt } from "@langchain/langgraph";

const decision = interrupt({data:"data of the interrupt you want to display to user"});
```
whenever you workflow execution will hit the `interrupt()` function it will stop that workflow, and send the interrupt data as response

#### Example:
consider a workflow:
```
STAT -> "interrupt_Node" -> END
```
`interrupt_Node` will do nothing and will just throw an interrupt
```js
import { Annotation, END, interrupt, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";

const schema = Annotation.Root({
    message: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        reducer: (prev, next) => prev.concat(next),
        default: () => [],
    }),
});

const graph = new StateGraph(schema);

async function interrupt_Node(state) {
    interrupt({ message: "Need human approval" });
}

graph.addNode("interrupt_Node", interrupt_Node);

graph.addEdge(START, "interrupt_Node");
graph.addEdge("interrupt_Node", END);

const workflow = graph.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: "1" } };

const res = await workflow.invoke({ message: [new HumanMessage("hey")] }, config);
console.log(res);
console.log(res.__interrupt__);
```
Output:
```js
{
  message: [
    HumanMessage {
      "content": "hey",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  ],
  __interrupt__: [ { id: '5cfdb2806ec369e3da51fd1b7e6c5a1a', value: [Object] } ]
}
[
  {
    id: '5cfdb2806ec369e3da51fd1b7e6c5a1a',
    value: { message: 'Need human approval' }
  }
]
```
- `res.message` is the state data carried by the workflow and is saved by checkPointer
- `res.__interrupt__` is the interrupt data

### command()
`command()` is used to send the human’s response back into a paused graph so it can continue execution.

If `interrupt()` is pause & ask, then `command()` is resume & answer.
```
AI runs
↓
interrupt()   ← pauses, asks human
⏸️
👤 human responds
↓
command()     ← resumes graph with input
↓
AI continues
```
#### In LangGraph
```js
import { Command, interrupt } from "@langchain/langgraph";

const userdata = interrupt({message:"Need human approval"});    

await workflow.invoke(new Command({resume: userdata}), config);
```
in above code snippet whenever we hit `interrupt()` the workflow execution will pause, and after the execution is paused and we hit `.invoke(new Command({resume: userdata}), config)`  it will resume it by sending the userdata to respective interrupt

#### Check out this code snippet:
workflow:
```
STAT -> "ask_user" -> END
```
code
```js
async function ask_user(state) {
    const userAns = interrupt({ message: "Say something" });
    console.log(userAns);   // {approved: userMessage}
}

graph.addNode("ask_user", ask_user);

graph.addEdge(START, "ask_user");
graph.addEdge("ask_user", END);

const workflow = graph.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: "1" } };

const res = await workflow.invoke({ message: [] }, config);

const userMessage = "hello";
const finalResult = await workflow.invoke(new Command({resume: {approved: userMessage}}), config);
```
from the above code snippet we can understand that whatever data we pass with `new Command({resume: {...}})` it will be available at it's respective interrupt

### Example 1: Basic understanding

consider a workflow:
```
STAT -> "ask_user" -> END
```
- at `ask_user` we have interrupt that will ask user to provide an input. 
- whatever input user will provide we simply add that into our state and return the final state
```js
import { Command, END, interrupt, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const schema = z.object({
    message: z.array(z.string),
});

const graph = new StateGraph(schema);

async function ask_user(state) {
    const userAns = interrupt({ message: "Say something" });
    return { message: userAns.userInput };
}

graph.addNode("ask_user", ask_user);

graph.addEdge(START, "ask_user");
graph.addEdge("ask_user", END);

const workflow = graph.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: "1" } };

const res = await workflow.invoke({ message: [] }, config);

const rl = readline.createInterface({ input, output });

const userInput = await rl.question(res.__interrupt__[0].value.message + "\n");

const finalResult = await workflow.invoke(new Command({ resume: { userInput } }), config);
console.log(finalResult);
```
output:
```
Say something
hello
{ message: 'hello' }
```
### Example 2: Approved based workflow
We are building a stock management chatbot that can perform two main actions:
1. Get stock price\
→ The chatbot can fetch and show the current price of any stock.
2. Buy stock\
→ The chatbot can place a buy order for a stock.

Although chatbot can fetch stock prices and buy stocks, but every purchase requires human approval to ensure safety.

Why Human Approval is Needed
- A human reviews the stock details
- The human approves or rejects the purchase
- Only after approval, the chatbot proceeds to buy the stock

This ensures:
- No accidental or risky purchases
- Better control over financial decisions

#### Workflow
``` 
            ┌───────────────┐        ┌─────> "get_stock_price"
            ▼      ┌─────> "tools" ──|
START ─> "agent" ──|                 └─────> "purchase_stock"        
                   └──────> END 
```

#### Code walkthrough
1. get Stock price tool
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";

async function getStockPrice({ symbol }) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

const stockPice = new DynamicStructuredTool({
    name: "get_stock_price",
    description: "use this tool to get stock price",
    func: getStockPrice,
    schema: z.object({
        symbol: z.string(),
    }),
});
```
2. Buy stock tool (Its a dummy tool)
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

function purchaseStock({ symbol, quantity }) {
    const approved = interrupt(`Approve buying ${quantity} shears of ${symbol} (y/n)`);
    if (approved === "y") {
        // payment gateway implementation
        return {
            status: 200,
            message: "stock purchase successfully",
            symbol,
            quantity,
        };
    } else {
        return {
            status: 400,
            message: "stock purchase failed",
        };
    }
}

const purchaseStockTool = new DynamicStructuredTool({
    name: "purchase_stock",
    description: "use this tool to purchase stock",
    func: purchaseStock,
    schema: z.object({
        symbol: z.string(),
        quantity: z.number(),
    }),
});
```
3. Initialize LLM with tools
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const llm_with_tool = llm.bindTools([stockPice, purchaseStockTool]);
```
4. Initialize a graph
```js
const graphState = Annotation.Root({
    messages: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        defaultValue: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
});

const graph = new StateGraph(graphState);
```
5. create chat node
```js
async function ChatNode(state) {
    const res = await llm_with_tool.invoke(state.messages);
    return { messages: [res] };
}

graph.addNode("chat_node", ChatNode);
```
6. create toolNode
```js
import { ToolNode } from "@langchain/langgraph/prebuilt";

const toolNode = new ToolNode([stockPice, purchaseStockTool]);

graph.addNode("tools", toolNode);
```
7. connect them by edges:
```js
graph.addEdge(START, "chat_node");
graph.addConditionalEdges("chat_node", toolsCondition);
graph.addEdge("tools", "chat_node");
```
mental model
``` 
            ┌─────────────────────┐        
            ▼          ┌─────> "tools" 
START ─> "chat_node" ──|                         
                       └──────> END 
```
8. invoke the workflow
```js
while (true) {  // user can communicate continuously
    let message = await rl.question("user: ");
    let res = await workflow.invoke({ messages: [new HumanMessage(message)] }, config);
}
```
9. check of interrupt
```js
while (true) {
    let message = await rl.question("user: ");
    let res = await workflow.invoke({ messages: [new HumanMessage(message)] }, config);
    if (res.__interrupt__) {
        // interrupt occur
    }
    // interrupt does not occur
}
```
10. take user input and complete the workflow
```js
while (true) {
    let message = await rl.question("user: ");
    let res = await workflow.invoke({ messages: [new HumanMessage(message)] }, config);
    if (res.__interrupt__) {
        const userInput = await rl.question(res.__interrupt__[0].value + " ");
        res = await workflow.invoke(new Command({ resume: userInput }), config);
    }
    console.log(res.messages[res.messages.length - 1].content + "\n"); //response message
}
```

#### Complete code
[Click here](./src/HITL/StockManagement.js) to check out the complete code and its output


[Go To Top](#content)

---
