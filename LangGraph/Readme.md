# Content
1. [Introduction](#introduction)


---

# Introduction
LangGraph is a Python/JS library (from the LangChain ecosystem) used to build LLM-powered applications as graphs instead of simple chains.

It is designed specifically for multi-step, often multi-agent LLM applications where you need fine-grained control over flow, memory, and error handling.


In simple words:
- LangChain = linear flow (step → step)
- LangGraph = flowchart with loops, branches, and memory


### Core idea
LangGraph treats your AI app as a directed graph:
- Nodes are functions/agents that do work (call an LLM, query a DB, run tools, apply business logic, ask the user, etc.).
- Edges define which node runs next, including branching (if/else), loops, and retries.
- State (chat history) is a shared, persistent object that flows through the graph, letting agents read/update context across turns and sessions.

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
> This graph like structure is what we called `workflow`

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
