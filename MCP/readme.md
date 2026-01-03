# Content
1. [Introduction](#introduction)
2. [Client & Server in MCP](#client--server-in-mcp)
---

# Introduction
MCP (Model Context Protocol) is a standard way for AI models to talk to external tools, data sources, and services in a structured and secure manner.

### Why MCP is needed (simple illustration)
Before MCP:
- Every AI tool integration was custom
- Different APIs, different formats
- Hard to reuse tools across models

Example:
```
GPT → custom JSON → GitHub tool
Claude → different JSON → same GitHub tool
```
> Same tool, rewritten again and again.

After MCP:
- One standard protocol
- Any AI model can connect to any MCP-compatible tool
- Plug-and-play tools 

```
AI Model  →  MCP Server  →  Tools / Data / APIs
```

### MCP standardizes:
1. How tools are described (name, inputs, outputs)
2. How AI calls tools
3. How tools respond
4. Context sharing between model and tools

### What an MCP Server Does
An MCP Server:
1. Advertises tools (what it can do)
2. Accepts tool calls from AI
3. Validates input
4. Executes real logic
5. Returns structured output

### MCP vs Tool Calling

#### 1. What is MCP and Tool / Function Calling?
Tool / Function Calling
- The LLM is trained to output a JSON structure
- Your app parses it
- Your app executes the function
- The result is sent back to the model

MCP\
protocol that defines:
- How tools are discovered
- How they are called
- How results are returned
- How context is maintained

#### 2. Key Architectural Difference
Tool Calling
```
AI Model → JSON → Your App → Tool Logic
```
MCP
```
AI Model → MCP Protocol → MCP Server → Tool Logic
```


[Go To Top](#content)

---
# Client & Server in MCP
MCP Client = the AI side\
MCP Server = the execution side

### What is the Client in MCP?
The client is:
- The AI model or
- The agent framework (LangChain, LangGraph, custom agent)

What the MCP client does
- Connects to an MCP server
- Discovers available tools
- Decides which tool to call
- Sends tool arguments
- Uses the response to continue reasoning
> Client THINKS, not WORKS

### What is the Server in MCP?
The server is:
- A running service (Node.js / Python / etc.)
- That exposes tools
- And executes real-world logic

What the MCP server does
- Stores API keys & secrets
- Talks to external APIs
- Reads databases / files
- Handles errors, retries, caching
- Returns structured results
> Server WORKS, not THINKS

### Server does the Heavy Lifting
All complex, risky, and resource-intensive work is done on the server — not by the AI model / MCP client.

The client only:
- Decides what to do
- Not how to do it

#### Example WITHOUT “server does the heavy lifting”
Scenario\
User: “Show me open GitHub issues”

Flow (Bad design)
```
AI Model
 ├─ Stores GitHub API key
 ├─ Knows GitHub REST API details
 ├─ Handles pagination
 ├─ Filters issues
 ├─ Handles errors
```
Problems:
- API key exposure
- AI must understand API details
- Logic duplicated per model
- Hard to maintain

### What the MCP Server handles (The “Heavy Lifting”)
1. Authentication & Security
    - Stores API keys
    - Manages permissions
    - Prevents misuse
2. Business Logic
3. Error Handling & Retries
    - Network failures
    - Rate limits
    - API changes
4. Performance Optimization
    - Caching
    - Batching
    - Throttling

[Go To Top](#content)

---