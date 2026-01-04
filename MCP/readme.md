# Content
1. [Introduction](#introduction)
2. [Client & Server in MCP](#client--server-in-mcp)
3. [Architecture](#architecture)
    - [Primitives](#primitives)
    - [Layers](#layers)
        - [Data Layer with JSON-RPC](#1-data-layer)
        - [Transport layer](#2-transport-layer)
4. [Lifecycle Management](#lifecycle-management)

---

# Introduction
MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems.

Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks.

Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

MCP is a stateful protocol as it maintain session during communication
> MCP maintains only basic session info by default (like the session ID and connection transport), but to make it fully stateful (with useful context like user data or history), you must add your own storage.
 

### Example
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
# Architecture 
MCP follows a client-server architecture where an MCP host — an AI application like `Claude Code` or `Claude Desktop` — establishes connections to one or more MCP servers.

The MCP host accomplishes this by creating one MCP client for each MCP server. Each MCP client maintains a dedicated connection with its corresponding MCP server.

The key participants in the MCP architecture are:
- **MCP Host:** The AI application that coordinates and manages one or multiple MCP clients
- **MCP Client:** A component that maintains a connection to an MCP server and obtains context from an MCP server for the MCP host to use
- **MCP Server:** A program that provides context to MCP clients

<img src="../images/mcp_architecture.png" style="width:600px">

## Primitives
MCP primitives are the most important concept within MCP. They define what clients and servers can offer each other.

primitives specify the types of contextual information that can be shared with AI applications and the range of actions that can be performed.

MCP defines three core primitives that servers can expose:
- **Tools:** Executable functions that AI applications can invoke to perform actions (e.g., file operations, API calls, database queries)
- **Resources:** Data sources that provide contextual information to AI applications (e.g., file contents, database records, API responses)
- **Prompts:** Reusable templates that help structure interactions with language models (e.g., system prompts, few-shot examples)

Each primitive type has associated methods for discovery (`*/list`), retrieval (`*/get`), and in some cases, execution (`tools/call`).

- Tools:
    - `tools/list`: Client asks the server: "What tools do you provide?"
    - `tools/call`: CLient tells the server: "Please run this tool with this argument"
- Resources:
    - `resource/list`: Client asks the server: "What resources are available?"
    - `resource/read`: Client say: "Give me the content fo this resources"
    - `resource/subscribe`: Client subscribe or unsubscribe from updates
- Prompts:
    - `prompts/list`: Client asks the server: "What prompts templates do you provide?"
    - `prompt/fetch`: Client fetches the specific prompt template

<img src="../images/pimitives.png" style="width:800px">

MCP also defines primitives that clients can expose. These primitives allow MCP server authors to build richer interactions.
- **Sampling**: 
    
    Allows servers to request language model completions from the client’s AI application. 
    
    This is useful when servers’ authors want access to a language model, but want to stay model independent and not include a language model SDK in their MCP server. 
    
    They can use the `sampling/complete` method to request a language model completion from the client’s AI application.

- **Elicitation**: 

    Allows servers to request additional information from users.
    
    This is useful when servers’ authors want to get more information from the user, or ask for confirmation of an action. 
    
    They can use the `elicitation/request` method to request additional information from the user.

- **Logging**: 

    Enables servers to send log messages to clients for debugging and monitoring purposes.

## Layers
MCP consists of two layers:
1. [**Data layer:**](#1-data-layer)\
The data layer in MCP is the part of the MCP server responsible for accessing, managing, and serving data (files, databases, logs, documents) to the AI in a safe and structured way.

2. [**Transport layer:**](#2-transport-layer)\
The transport layer in MCP defines how MCP messages are transmitted between the AI client and the MCP server, independent of the tools or logic being executed.


## 1. Data layer:
The data layer in MCP is the part of the MCP server responsible for accessing, managing, and serving data (files, databases, logs, documents) to the AI in a safe and structured way.

It is the language and grammar of the MCP ecosystem that everyone agrees to communicate

It uses JSON-RPC based protocol for client-server communication, including lifecycle management, and core primitives, such as tools, resources, prompts and notifications.

### JSON-RPC
JSON-RPC is a lightweight **remote procedure call** (RPC) protocol that lets a client call methods on a server using JSON messages.

A **Remote Procedure Call** allows a program to execute a function on another computer as if it were local, hiding the details of network communication and data transfer. this abstraction make it easier to build distributed application

**JSON-RPC** combine the concept of remote procedure call with the simplicity of JSON, allowing developer to structure RCP request and response in a standardize JSON format

**Example of JSON-RPC**

Normal function call (local)
```js
add(2, 3)
```
JSON-RPC (remote function call)
```json
{
  "method": "add",
  "params": [2, 3]
}
```

**JSON-RPC Request Structure**
```json
{
  "jsonrpc": "2.0",
  "method": "getUser",
  "params": {
    "id": 101
  },
  "id": 1
}
```
| Field   | Purpose            |
| ------- | ------------------ |
| jsonrpc | Protocol version   |
| method  | Function name      |
| params  | Arguments          |
| id      | Request identifier |

**JSON-RPC Response (Success)**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "name": "Amit",
    "role": "Student"
  },
  "id": 1
}
```
**JSON-RPC Response (Error)**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
```

#### Notifications
A notification is a JSON-RPC message sent by a client or server without expecting any response.

The protocol supports real-time notifications to enable dynamic updates between servers and clients.

For example,\
when a server’s available tools change—such as when new functionality becomes available or existing tools are modified—the server can send tool update notifications to inform connected clients about these changes.

JSON-RPC Notification Format
```json
{
  "jsonrpc": "2.0",
  "method": "log",
  "params": {
    "message": "Tool have been updated"
  }
}
```
Key difference from a normal request
- Normal request
    - Has an `id` 
    - Expects a response
- Notification
    - No `id`
    - No response
## 2. Transport layer
The transport layer manages communication channels and authentication between clients and servers. 

It handles connection establishment, message framing, and secure communication between MCP participants.

MCP supports two transport mechanisms:
- **Stdio transport:** Uses standard input/output streams for direct process communication between local processes on the same machine, providing optimal performance with no network overhead.

- **Streamable HTTP transport:** Uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming capabilities. This transport enables remote server communication and supports standard HTTP authentication methods including bearer tokens, API keys, and custom headers. MCP recommends using OAuth to obtain authentication tokens.


[Go To Top](#content)

---

# Lifecycle Management
Lifecycle management in MCP is how an MCP client and MCP server start, communicate, maintain state, and shut down safely during an interaction.

#### Illustration
Web app lifecycle
```
Server starts → Request → Process → Response → Close
```
MCP lifecycle
```
Connect → Discover → Execute → Maintain Context → Close
```

MCP Lifecycle Generally occur three phase
1. Initialization Phase
2. Operation Phase
3. Shut down phase

## 1. Initialization Phase
The initialization phase must be the first interaction between client and server

Initialization phase does two main thing:
1. **Establish protocol version compatibility:**\
Make sure both client and server communicate over same version of MCP protocol
    > Client has a list of MCP version he can work with, if server operates on any of those version client connect with the server otherwise does not connect
2. **exchange and negotiate capability:**\
Both client and server shear some basic details  (like available tools, ect.) with each other, adn decide which features will be available during the session


#### Step 1: Send initialize  request
client sends an **initialize** request to sever

> The client should not send any other request (except PING) before the server has responded to this `initialize` request

Example:
```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {
    "clientName": "ai-agent",
    "protocolVersion": "2025-03-26"
  },
  "id": 1
}
```
here:
- `"method": "initialize"` -> we car calling `initialize` method on server
- `"protocolVersion": "2025-03-26"` -> MCP protocol version that  client uses
- you can also pass other info if you want like `"clientName": "ai-agent"`
 
#### Step 2: Server respond
in response of clients `initialize` request server respond with sending his own capabilities

Example:
```json
{
    "jsonrpc": "2.0",
    "result": {
        "protocolVersion": "2025-03-26",
        "capabilities":{
            "tools": ["getUserOrders", "readFile"],
            "resources": ["file://docs/*"],
            "prompts": ["summarizeOrders"]
        },
        "serverInfo":{
            "name":"fileSystemServer", 
            "version":"2.5.1"
        },
        "instruction":"Server is ready to accept the command"
    },
    "id": 1
}
```
Here:
- `"protocolVersion": "2025-03-26"` -> MCP protocol version that  server uses
- `"capabilities":{}` -> capabilities of server 
- you may get some extra info like `serverInfo` and `instruction`



#### Step 3: Handshake Complete via notification
After successful initialization, the client must send an `initialized notification` to indicate it is ready to began normal operation

> The server should not send any request (except PING and logging) to client before receiving `initialized notification`

Example:
```json
{
    "jsonrpc": "2.0",
    "method":"notification/initialized"
}
```
Now thw client and sever is connected

## 2. Operation Phase
During operation phase, the client and server exchange the message according to the negotiate capabilities

during message exchange client must:
- Respect the negotiated protocol version
- only use capabilities that were successfully negotiated

#### Capability Discovery
Client learns what server is capable of, like what tools, resources and prompt are available on sever

we use `*/list` to get this info

This request are trigger automatically once the Initialization phase complete successfully and client connect to the server 

Example:
- Client → Server (Tool Discovery Request)

    ```json
    {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "tools/list",
      "params": {}
    }
    ```
- Server → Client (Tool Discovery Response)

    ```json
    {
      "jsonrpc": "2.0",
      "id": 1,
      "result": {
        "tools": [
          {
            "name": "getWeather",
            "description": "Get current weather for a city",
            "inputSchema": {
              "type": "object",
              "properties": {
                "city": {
                  "type": "string",
                  "description": "Name of the city"
                }
              },
              "required": ["city"]
            }
          },
          {
            "name": "calculateSum",
            "description": "Add two numbers",
            "inputSchema": {
              "type": "object",
              "properties": {
                "a": { "type": "number" },
                "b": { "type": "number" }
              },
              "required": ["a", "b"]
            }
          }
        ]
      }
    }
    ```
#### Tool Calling
once client gets the list of all available tool from server it give that list to Host, and it is responsibility of Host to stores that list safely, and map the tool according to users query

client does not know which tool to call Host decide which tool to call with what arguments

we use `tools/call` for tool calling from client to server 

Example:

- user query: what is 5 pluse 10?

- Host decides:
    - Tool: `calculateSum`
    - Arguments: `{ "a" : 5, "b" : 10 }`

- client to server:

    ```json
    {
      "jsonrpc": "2.0",
      "id": 2,
      "method": "tools/call",
      "params": {
        "name": "calculateSum",
        "arguments": {
          "a": 5,
          "b": 10
        }
      }
    }
    ```
- Server → Client

    ```json
    {
      "jsonrpc": "2.0",
      "id": 2,
      "result": {
        "output": 15
      }
    }
    ```
## 3. Shut Down phase
- one side (generally client) initiate the shut down
- No special JSON-RPC shutdown message is need during this phase
- [Transport layer](#2-transport-layer) is responsible for signaling the termination

> server generally does not initiate the shutdown unless there is any technical issue like server crash, ect. 

#### Shut down in STDIO (local server)
client Initiate Shutdown
- client close the input stream to the server and wait for server to exit
- if server does not exit:
    - send `SIGTERM` OS command to terminate the child process where server is up and running
    - if server is still running event after `SIGTERM` client send another OS command `SIGKILL` to kill the child process where server is up and running

Server Initiate shutdown
- server close the output stream for client and exit

#### Shut down in HTTP (remote server)
client Initiate Shutdown
- the client (Host) close the http connections it opened with server 

Server Initiate shutdown
- the server close the http connection form his side
- The client must be prepared to detect a dropped connection and handle it (eg., reconnect if appropriate) 

## Error Handling & Recovery
- Server Returns structured error
- Client adapts reasoning

Example:
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 4
}
```



[Go To Top](#content)

---