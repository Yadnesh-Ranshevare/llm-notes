# Content
1. [Introduction](#introduction)
2. [Installation](#installation)

---

# Introduction
LangChain is a framework for building applications that use large language models (LLMs) like GPT, Claude, Llama, etc.

Instead of calling a model directly, LangChain helps you chain together many steps—retrieval, reasoning, tools, memory, and more—to create powerful AI applications.

LangChain provides a pre-built agent architecture and model integrations to help you get started quickly and seamlessly incorporate LLMs into your agents and applications.

LangChain agents are built on top of LangGraph in order to provide durable execution, streaming, human-in-the-loop, persistence, and more. 
>You do not need to know LangGraph for basic LangChain agent usage.

### What LangChain Does
LangChain gives you building blocks to create:
- Chatbots
- RAG systems (Retrieval-Augmented Generation)
- Agents that use tools/APIs
- Document analyzers
- Workflow pipelines

### Core Components & Structure
LangChain for JS/TS is modular, offering these building blocks (among others) for constructing LLM-powered apps.
- **Models** — These are wrappers around different LLM providers. You can switch models (OpenAI → Gemini → Llama) without changing your whole code.
- **Agents** — These are “smart workers” powered by an LLM. They can think, decide, and use tools to complete tasks (like calling APIs or searching data).
- **Tools** — external functions or APIs (like retrieving data, calling external services) that agents (or prompts) can use.
- **Memory & Messaging / Context Handling** — This lets your app remember previous messages or state. Useful for chatbots or any “ongoing conversation”.
- **Structured Output & Streaming / Middleware / Guardrails** — support for structured responses (JSON response, stream responses token-by-token, etc) and safe, controlled flows.

In addition, there is a broader ecosystem:
- **LangChain “Core”:**

    This is the main package that gives:
    - models
    - tools
    - memory
    - core logic
    
    Think of it as the backbone.
- **LangChain “Community”**

    This provides extra integrations like:
    - 3rd-party LLMs
    - vector databases
    - APIs
    - tools

    Useful when you need more than the basics.
- **LangGraph Integration:**

    A lower-level framework for:
    - advanced workflows
    - branching logic
    - looping
    - state machines
    - human-in-the-loop interactions
    - persistence

    Think of it as power tools for bigger AI systems.
- A developer platform LangSmith — helps debug, monitor, test and evaluate LangChain-based applications.

### Core benefits
- Standardized model interface — regardless of which LLM provider you choose, you use the same interface. Means less friction switching providers and avoid vendor lock-in. 
- Modularity & extensibility — you can mix & match models, tools, memories, data sources. It’s like building with Lego blocks. 
- TypeScript/JavaScript support — works well with Node.js, front-end frameworks, serverless setups, making it ideal for web developers. 
- Ecosystem & integrations — because many providers/tools are supported (data sources, databases, APIs, vector stores, etc.), you don’t need to code every integration from scratch. 
- Observability & evaluation tools — debugging and monitoring are built in (via LangSmith), which helps during prototyping and production.


[Go To Top](#content)

---
# Installation
To install the LangChain package:
```bash
npm install langchain @langchain/core
# Requires Node.js 20+
``` 
**After above command langchain will be installed**

### Also know that

LangChain provides integrations to hundreds of LLMs and thousands of other integrations. These live in independent provider packages.
```bash
# Installing the OpenAI integration
npm install @langchain/openai
# Installing the Anthropic integration
npm install @langchain/anthropic
```
> install above langchain packages as per the need


[Go To Top](#content)

---