# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Document Loaders](#document-loaders)

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
# create node environment
npm init -y

# install dependencies
npm install langchain 
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
# Document Loaders
Document loaders provide a standard interface for reading data from different sources (such as Slack, Notion, or Google Drive) into LangChain’s Document format. This ensures that data can be handled consistently regardless of the source.

> visit https://docs.langchain.com/oss/javascript/integrations/document_loaders for complete information

### Syntax
Each document loader may define its own parameters, but they share a common API:

- `.load()`: Loads all documents at once.
- `.loadAndSplit()`: Loads all documents at once and splits them into smaller documents.

Example:
```js
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

const loader = new CSVLoader(
  ...  // <-- Integration specific parameters here
);
const data = await loader.load();
```

### category
LangChain.js categorizes document loaders in two different ways:
- File loaders, which load data into LangChain formats from your local filesystem.
- Web loaders, which load data from remote sources.

### Document Data structure
In RAG (Retrieval-Augmented Generation), a document is not just a raw text file—it’s usually structured into a data object so that your retrieval system can efficiently search, chunk, and feed content to the LLM. Here’s a clear breakdown.

#### Basic Concept
A document represents a piece of information you want your LLM to “know” or retrieve from.

It’s often represented like this in LangChain:
```js
{
  pageContent: "The text content of the document or chunk",
  metadata: {
    source: "path/to/file.pdf",
    page: 1,
    section: "Introduction"
  }
}
```
#### Key Components
| Field         | Purpose                                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `pageContent` | The actual text to be retrieved and sent to the LLM. Could be a paragraph, a page, or a chunk.                                                  |
| `metadata`    | Extra info about the document. Can include: file path, page number, author, date, tags, or any identifier. Useful for filtering or attribution. |

# Example of PDFLoader
To access PDFLoader document loader you’ll need to install the `@langchain/community` integration, along with the `pdf-parse` package.

### Installation
The LangChain PDFLoader integration lives in the `@langchain/community `package:
```bash
npm install @langchain/community pdf-parse @langchain/core 
```
> make sure the version of other installed packages (like dotenv) are compatible

### Instantiation
Now we can instantiate our model object and load documents:
```js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

const pdfPath = "./src/Documentloaders/docs/pdfLoder.pdf"   // make sure this is the path from root of the project

const loader = new PDFLoader(pdfPath)
```
### Load
```js
const docs = await loader.load()
console.log({ docs })
```
### Code
```js
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

const pdfPath = "./src/Documentloaders/docs/pdfLoder.pdf"

const loader = new PDFLoader(pdfPath)

const docs = await loader.load()
console.log({ docs })
```
Output:
```
Warning: TT: undefined function: 32
{
  docs: [
    Document {
      pageContent: '\n' +
        '\n' +
        'X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345\n' +
        '\n' +
        '
        .
        .
        .
        .
        'Paper / Subject Code: 32428 / Department Optional Course-I:  Advanced Data Structure & Analysis\n' +
        'X237Y7DF345X237Y7DF345X237Y7DF345X237Y7DF345',
      metadata: [Object],
      id: undefined
    }
  ]
}
```
> similarly you can load other document \
> to understand how to load other files visit https://docs.langchain.com/oss/javascript/integrations/document_loaders for complete information


[Go To Top](#content)

---
# Integrating with Gemini
1. install dependencies
```bash
npm install @langchain/google-genai 
```
```bash
npm install dotenv
```
2. get the gemini api key and store it in .env file
```env
API_KEY=YOUR_API_KEY_HERE
```
3. import `ChatGoogleGenerativeAI` from `@langchain/google-genai`
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
```
4. create the object of `ChatGoogleGenerativeAI`

```js
const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",   //model you wanna use
    apiKey: process.env.API_KEY,        // your api key
});
```
> visit https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY to check the available gemini models
5. use `.invoke()` method to call the LLM
```js
const response = await llm.invoke("Explain LangChain in one line.");
```
### Code
```js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const response = await llm.invoke("Explain LangChain in one line.");
console.log(response.content);
```
Output:
```
LangChain is a framework that enables building powerful applications by orchestrating Large Language Models with external data and tools.
```
### Customization
ChatGoogleGenerativeAI accepts several parameters beyond model and apiKey to control generation, safety, retries, and more. These map directly to Gemini API options for fine-tuned behavior

Core Generation Parameters
```js
const llm = new ChatGoogleGenerativeAI({
  model: "models/gemini-2.5-flash",
  apiKey: process.env.API_KEY,
  temperature: 0.7,        // 0.0-1.0, controls randomness (same as softmax function)
  topK: 40,                // Top-k sampling (1-40), limits token choices
  topP: 0.95,              // Top-p/nucleus sampling (0.0-1.0)
  maxOutputTokens: 2048,   // Max tokens in response (model-dependent max)
  stopSequences: ["\n\n"], // Array of strings to stop generation
});
```



[Go To Top](#content)

---