# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Document Loaders](#document-loaders)
4. [Text splitters](#text-splitters)
5. [Embedding models](#embedding-models)
6. [Vector Stores](#vector-stores)
7. [Retriever](#retriever)
8. [Integrating with Gemini](#integrating-with-gemini)
9. [Messages](#messages)

> for this tutorial we'll be using Gemini api key (free api key)
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
# Text splitters
Text splitters break large docs into smaller chunks that will be retrievable individually and fit within model context window limit.

There are several strategies for splitting documents, each with its own advantages.

There are three different ways to split the text:
1. [Text structure-based](#text-structure-based)
2. [Length-based](#length-based)
3. [Document structure-based](#document-structure-based)

### Text structure-based
Text is naturally organized into hierarchical units such as paragraphs, sentences, and words. 

We can leverage this inherent structure to inform our splitting strategy, creating split that maintain natural language flow, maintain semantic coherence within split, and adapts to varying levels of text granularity.

LangChain’s `RecursiveCharacterTextSplitter` implements this concept:
- The RecursiveCharacterTextSplitter attempts to keep larger units (e.g., paragraphs) intact.
- If a unit exceeds the chunk size, it moves to the next level (e.g., sentences).
- This process continues down to the word level if necessary.


#### Example:
1. load the document
```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const Path = "./src/Documentloaders/docs/txtLoder.txt"
const loader = new TextLoader(Path)

const docs = await loader.load()
console.log({ docs })
```

2. create the new object of `RecursiveCharacterTextSplitter`
```js
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
```
3. use this splitter to split the pageContent of the document
```js
const texts = await splitter.splitText(docs[0].pageContent)
```

#### Code:
```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
const texts = await splitter.splitText(docs[0].pageContent)

console.log({ texts })
```
- **chunkSize**: The maximum size of a chunk,
- **chunkOverlap**: Target overlap between chunks. Overlapping chunks helps to mitigate loss of information when context is divided between chunks.
output:
```
{
  texts: [
    'LangChain is a framework for building applications that use large language models (LLMs) like GPT,',
    'Claude, Llama, etc.',
    'Instead of calling a model directly, LangChain helps you chain together many steps—retrieval,',
    .
    .
    .
    .
    'Useful for chatbots or any “ongoing conversation”.',
    'Structured Output & Streaming / Middleware / Guardrails — support for structured responses (JSON',
    'response, stream responses token-by-token, etc) and safe, controlled flows.'
  ]
}
```

### Length-based
An intuitive strategy is to split documents based on their length. This simple yet effective approach ensures that each chunk doesn’t exceed a specified size limit. 

Key benefits of length-based splitting:
- Straightforward implementation
- Consistent chunk sizes
- Easily adaptable to different model requirements

Types of length-based splitting:
- [Token-based](#splitting-by-token): Splits text based on the number of tokens, which is useful when working with language models.
- [Character-based](#splitting-by-character): Splits text based on the number of characters, which can be more consistent across different types of text.

#### Splitting by token
Language models have a token limit. You should not exceed the token limit. When you split your text into chunks it is therefore a good idea to count the number of tokens. 

There are many tokenizers. When you count tokens in your text you should use the same tokenizer as used in the language model.
> We can use tiktoken to estimate tokens used using TokenTextSplitter. It will probably be more accurate for OpenAI mdoels.
1. load the document
```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const Path = "./src/Documentloaders/docs/txtLoder.txt"
const loader = new TextLoader(Path)

const docs = await loader.load()
console.log({ docs })
```

2. create the new object of `TokenTextSplitter`
```js
// Example: use cl100k_base encoding
const splitter = new TokenTextSplitter({ encodingName: "cl100k_base", chunkSize: 10, chunkOverlap: 0 });
```
3. use this splitter to split the pageContent of the document
```js
const texts = await splitter.splitText(docs[0].pageContent);
```
code:
```js
import { TokenTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()


const splitter = new TokenTextSplitter({ encodingName: "cl100k_base", chunkSize: 10, chunkOverlap: 0 });

const texts = await splitter.splitText(docs[0].pageContent);
console.log(texts);
```
Output:
```
[
  'LangChain is a framework for building applications that use',
  ' large language models (LLMs) like GPT',
  .
  .
  .
  .
  ' response, stream responses token-by-token, etc)',
  ' and safe, controlled flows.'
]
```
#### Splitting by character
Character-based splitting is the simplest approach to text splitting. It divides text using a specified character sequence (default: `"\n\n"`), with chunk length measured by the number of characters.

Key points:
1. How text is split: by a given character separator.
2. How chunk size is measured: by character count.

how to use?

1. load the document
```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const Path = "./src/Documentloaders/docs/txtLoder.txt"
const loader = new TextLoader(Path)

const docs = await loader.load()
console.log({ docs })
```

2. create the new object of `TokenTextSplitter`
```js
const splitter = new CharacterTextSplitter({
    separator: "\n\n",
    chunkSize: 1000,
    chunkOverlap: 200,
});
```
3. use this splitter to split the pageContent of the document
```js
const texts = await splitter.splitText(docs[0].pageContent);
```

Code:
```js
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { CharacterTextSplitter } from "@langchain/textsplitters";

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()

const splitter = new CharacterTextSplitter({
    separator: "\n\n",
    chunkSize: 1000,
    chunkOverlap: 200,
});
const texts = await splitter.splitText(docs[0].pageContent)

console.log({ texts })
```
Output:
```
{
  texts: [
    'LangChain is a framework for building applications that use large language models (LLMs) like GPT, Claude, Llama, etc.\r\n' +
      '\r\n' +
      'Instead of calling a model directly, LangChain helps you chain together many steps—retrieval, reasoning, tools, memory, and more—to create powerful AI applications.\r\n' +
      .
      .
      .
      .
      'Tools — external functions or APIs (like retrieving data, calling external services) that agents (or prompts) can use.\r\n' +
      'Memory & Messaging / Context Handling — This lets your app remember previous messages or state. Useful for chatbots or any “ongoing conversation”.\r\n' +
      'Structured Output & Streaming / Middleware / Guardrails — support for structured responses (JSON response, stream responses token-by-token, etc) and safe, controlled flows.'
  ]
}  
```

### Document structure-based
Some documents have an inherent structure, such as HTML, Markdown, or JSON files. In these cases, it’s beneficial to split the document based on its structure, as it often naturally groups semantically related text. 

Key benefits of structure-based splitting:
- Preserves the logical organization of the document
- Maintains context within each chunk
- Can be more effective for downstream tasks like retrieval or summarization


Example:
```js
const markdownText = `
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn't split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
`;

const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    { chunkSize: 60, chunkOverlap: 0 }
);
const mdDocs = await mdSplitter.createDocuments([ markdownText ]);
console.log(mdDocs);
```
Output:
```
[
  Document {
    pageContent: '# 🦜️🔗 LangChain',
    metadata: { loc: [Object] },
    id: undefined
  },
  .
  .
  .
  .
  Document {
    pageContent: 'are extremely open to contributions.',
    metadata: { loc: [Object] },
    id: undefined
  }
]
```

you can use two different methods to split the text:
#### 1. createDocuments()
- Used when you have raw text strings.
- Converts each string into one or more Document objects after splitting into chunks.

Input:
```js
// array of strings
["This is some text", "Another document"]
```
output:
```js
[
  { pageContent: "This is some", metadata: {} },
  { pageContent: "text", metadata: {} },
  { pageContent: "Another document", metadata: {} }
]
```
#### 2. splitDocuments()
- Used when you already have Document-like objects, usually `{ pageContent, metadata }`.
- Splits each `pageContent` into chunks while preserving or optionally transforming metadata.

Input:
```js
// langchain document
[
  { pageContent: "This is some text", metadata: { source: "file1.md" } }
]
```
Output:
```js
[
  { pageContent: "This is some", metadata: { source: "file1.md" } },
  { pageContent: "text", metadata: { source: "file1.md" } }
]
```

[Go To Top](#content)

---
# Embedding models
Embedding models transform raw text—such as a sentence, paragraph, or tweet—into a fixed-length vector of numbers that captures its semantic meaning. 

These vectors allow machines to compare and search text based on meaning rather than exact words.

In practice, this means that texts with similar ideas are placed close together in the vector space. 

For example, instead of matching only the phrase “machine learning”, embeddings can surface documents that discuss related concepts even when different wording is used.


### How it works
1. **Vectorization** — The model encodes each input string as a high-dimensional vector.
2. **Similarity scoring** — Vectors are compared using mathematical metrics to measure how closely related the underlying texts are.


### Similarity metrics
Several metrics are commonly used to compare embeddings:
- **Cosine similarity** — measures the angle between two vectors.
- **Euclidean distance** — measures the straight-line distance between points.
- **Dot product** — measures how much one vector projects onto another.

> If you want you can study about them in details
### Installation
```bash
npm i @langchain/google-genai
```
> this will only work for google-gemini embedding models
>
>visit [Langchain official doc](https://docs.langchain.com/oss/javascript/integrations/text_embedding#install-and-use) to see all available embedding models inside the langchain

### Apply embedding to user query
> use `.embedQuery()` to embed the users query
```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";


// visit https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY to check the available gemini models
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",        // embedding model
    apiKey: process.env.API_KEY,
});

const query = "What is LangChain?"; // users query

const queryVector = await embeddings.embedQuery(query);     // vectorize the user query

console.log("Query embedding", queryVector);
```
Output:
```
Query embedding [
   -0.011633233,   0.020551719,   -0.06830386,  0.009211681,  0.019681403,
    0.010037485, -0.0071844985,  -0.042993635,  0.012465412,  0.031368688,
    0.023457045,   0.029888691,  -0.004372305, -0.016773095, -0.018459162,
   -0.048110675,   0.031264417,    0.01721032, -0.024691908,  0.020023072,
    0.036955945,  -0.059124727,  -0.008912887, -0.096009605,  0.013825757,
    0.030610308,  -0.014870974,  -0.009988508, -0.024374863,  -0.05932398,
   -0.008637168,   0.012626924, -0.0135745965, -0.046352774, -0.041819047,
   -0.007222278,   0.060340635,    0.06739573,  0.038038787,  -0.08511597,
   0.0025634451,    0.04196518,   -0.02231868,  0.040211476,  0.004816831,
    -0.01744626,  -0.006854303,  -0.035560902, -0.044005606,  0.046498597,
    0.055162583,  -0.052838486,   0.004231976,  0.014036072,  -0.03367846,
   -0.011453093,   -0.04240064,  -0.026344324,  0.015171018,  0.035251103,
   -0.054377217,  -0.054407068,   -0.00492394,  0.005642689, -0.015765632,
  -0.0040119356,  -0.024086278,  -0.025097437, -0.025110612, -0.010727468,
   -0.018270561,   -0.03047294,  -0.052052747,   0.08847631, -0.030005176,
   0.0002601074,   0.008671283,     -0.054352,  0.027962198,  0.054818887,
    -0.04487978,   0.015204047,   0.080716215,   0.05270874,  0.023709174,
   -0.021791607,  -0.037845265,   -0.03348395, -0.022787504, -0.019574404,
     0.09191027,    0.01798471,  -0.057376504,  -0.03547161,  0.006236213,
    -0.05575946,  -0.014101476,    -0.0369929,  0.014690064,   0.05317924,
  ... 668 more items
]
```
### Apply embedding to external document
> use `.embedDocuments()` to embed the document
```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// visit https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY to check the available gemini models
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});

// load the document
const pdfPath = "src/Documentloaders/docs/pdfLoder.pdf";
const loader = new PDFLoader(pdfPath);
const docs = await loader.load();

const docVectors = await embeddings.embedDocuments([docs[0].pageContent]);  // make sure to pass it as array
console.log("First document embedding:", docVectors);
```
Output:
```
First document embedding: [
  [
       0.025972286,   0.06951625,  -0.036884665,   0.006119636,
    -0.00038492068,  0.037782744,    0.06710214,  0.0014668342,
       0.030839918, -0.003994771,   0.006866431,   0.010528142,
        0.03753436, -0.009272491,   0.047622565,  -0.009961679,
        0.07707975,   0.06210175, -0.0105818445,  -0.027111871,
      -0.015954804, -0.007481907,  0.0056739543,  -0.015849307,
      -0.004006042,  0.007290338,  -0.023676949,  -0.028017782,
       0.019127155, -0.005161905,   0.010407524,    0.05857893,
      0.0038561267,  -0.06233286,     0.0559272,   0.027748844,
      -0.023609092,  0.043413498,  -0.010317879,   -0.02025736,
        -0.0728308, -0.002538186, -0.0065100435,    0.02764335,
      -0.015824996,  -0.05881568,  -0.017992746,   -0.00113109,
      -0.031587347,     0.029191,  -0.013843597,   0.004347335,
       0.015786543,  0.010009333,   -0.04466593,   -0.05784301,
      -0.040200606,  -0.04079447,   0.026107697,  -0.011604448,
       0.012420686, -0.058606524,   0.026979115,   -0.05138485,
     -0.0023128972, 0.0021711893,   -0.05682902,   0.020140886,
       -0.07061889,  0.009255465,  -0.026517913,    0.03497874,
       -0.08342945,  0.070646495,  -0.007701792,  -0.009733487,
        0.05912657, -0.024372824,  0.0025202236,   0.020577025,
      -0.014081955,  0.008690964,    0.04462121, -0.0047489987,
       0.012904453,  0.015213231,   0.020345602,   -0.07314612,
      -0.037905626,  -0.02175902,   0.038363066,    0.02339358,
       0.006800187,  0.015965229,   0.089833125,  -0.045736484,
       -0.06833667,  -0.09865769,   0.036999863,    0.03394796,
    ... 668 more items
  ]
]
```




[Go To Top](#content)

---
# Vector Stores
A vector-store stores embedded data and performs similarity search.

LangChain provides a unified interface for vector stores, allowing you to:
- **addDocuments** - Add documents to the store.
- **delete** - Remove stored documents by ID.
- **similaritySearch** - Query for semantically similar documents.

### How to configure Vector store inside Langchain
> as an example we'll be seeing how to configure ChromaDb (Vector Db), if you want you can setup whichever db you want it just changes how we create vector store object rest of the code remains the same
> 
> visit [Langchain official doc](https://docs.langchain.com/oss/javascript/integrations/vectorstores#all-vector-stores) to check the list all available vector db inside the langchain
#### 1. install the dependencies
```bash
npm i chromadb
```
#### 2. import the `chroma` from `@langchain/community/vectorstores`
```js
import { Chroma } from "@langchain/community/vectorstores/chroma";
```

#### 3. create the embedding model
```js
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});
```
#### 4. create the new object of `chroma`
> Only this steps as we change the db otherwise rest of the configuration remains the same
```js
const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection",  // you can give any name to your collection, in DB your vector will be stored under this collection
  chromaCloudAPIKey: process.env.CHROMA_API_KEY,
  clientParams: {
    host: "api.trychroma.com",
    port: 8000,
    ssl: true,
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE,
  },
});
```
> visit [Chroma](https://www.trychroma.com/) to get all the credentials

> visit [Langchain official chroma doc](https://docs.langchain.com/oss/javascript/integrations/vectorstores/chroma) to understand how to set up chroma locally
#### 5. use `vectorStore.addDocuments()` to add the documents inside the db
```js
import { Document } from "@langchain/core/documents";
const document = new Document({
  pageContent: "Hello world",
});
await vectorStore.addDocuments([document]);
```
to add multiple document at once
```js
await vectorStore.addDocuments([document1, document2, document3, document4], { ids: ["1", "2", "3", "4"] })    // no. of ids are equal to no. of documents we are adding 
```
> if you didn't provide ids array chroma db will assign random ids to each document 
#### 6. use `vectorStore.similaritySearch()` to perform similarity search on stored data
```js
const results = await vectorStore.similaritySearch("Hello world", 10);
```
Many vector stores support parameters like:
- k — number of results to return
- filter — conditional filtering based on metadata (e.g., source, date)

example
```js
vectorStore.similaritySearch("query", 2, { source: "tweets" });
```
#### 7. use `vectorStore.delete()` to delete the sorted data
```js
await vectorStore.delete({ ids: ["4"] });
```

### Complete code
```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});


const document1 = {
  pageContent: "The powerhouse of the cell is the mitochondria",
  metadata: { source: "https://example.com" }
};

const document2 = {
  pageContent: "Buildings are made out of brick",
  metadata: { source: "https://example.com" }
};

const document3 = {
  pageContent: "Mitochondria are made out of lipids",
  metadata: { source: "https://example.com" }
};

const document4 = {
  pageContent: "The 2024 Olympics are in Paris",
  metadata: { source: "https://example.com" }
}

const documents = [document1, document2, document3, document4];

const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection",
  chromaCloudAPIKey: process.env.CHROMA_API_KEY,
  clientParams: {
    host: "api.trychroma.com",
    port: 8000,
    ssl: true,
    tenant: process.env.CHROMA_TENANT,
    database: process.env.CHROMA_DATABASE,
  },
});

await vectorStore.addDocuments(documents, { ids: ["1", "2", "3", "4"] });

const filter = { source: "https://example.com" };

const similaritySearchResults = await vectorStore.similaritySearch("biology", 2, filter);
console.log("Similarity Search Results:", similaritySearchResults);

// await vectorStore.delete({ ids: ["4"] });
```
Output:
```
Similarity Search Results: [
  Document {
    pageContent: 'Mitochondria are made out of lipids',
    metadata: { source: 'https://example.com' },
    id: '3'
  },
  Document {
    pageContent: 'The powerhouse of the cell is the mitochondria',
    metadata: { source: 'https://example.com' },
    id: '1'
  }
]
```

[Go To Top](#content)

---
# Retriever
A retriever is a component in langchain that fetches relevant documents from a data source in response of user's query

Retrievers accept a string query as input and return a list of Document objects.

### Classification of Retriever
1. Based on data source:
    - example:\
    **Wikipedia Retriever**: Search Wikipedia -> Fetch relevant articles\
    **VectorDb retriever**: search vector db -> retriever relevant document\
    ect...
2. Based on search strategy:
    - different retriever used different strategy for retrieving the relevant document 
    - example:\
    MMR\
    multi-query retrieval\
    etc...

### Vector Store Retriever
vector store retriever in langchain is the most common type of the retriever that lets you search and fetch the document from a vector store based on semantic similarity

1. Initiate the vector store
```js
const vectorStore = new Chroma(embeddings, {
    collectionName: "a-test-collection",
    chromaCloudAPIKey: process.env.CHROMA_API_KEY,
    clientParams: {
        host: "api.trychroma.com",
        port: 8000,
        ssl: true,
        tenant: process.env.CHROMA_TENANT,
        database: process.env.CHROMA_DATABASE,
    },
});
```
2. create the retriever
```js
const vectorRetriever = vectorStore.asRetriever({ k: 3 });  // k -> no. of output document 
```
3. call the retriever
```js
const retrieved_chunks = await vectorRetriever.invoke(test_query);
```
#### Example Code
```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// some sample text chunks
const chunks = [
    "Microsoft acquired GitHub for 7.5 billion dollars in 2018.",
    "Tesla Cybertruck production ramp begins in 2024.",
    "Google is a large technology company with global operations.",
    "Tesla reported strong quarterly results. Tesla continues to lead in electric vehicles. Tesla announced new manufacturing facilities.",
    "SpaceX develops Starship rockets for Mars missions.",
    "The tech giant acquired the code repository platform for software development.",
    "NVIDIA designs Starship architecture for their new GPUs.",
    "Tesla Tesla Tesla financial quarterly results improved significantly.",
    "Cybertruck reservations exceeded company expectations.",
    "Microsoft is a large technology company with global operations.",
    "Apple announced new iPhone features for developers.",
    "The apple orchard harvest was excellent this year.",
    "Python programming language is widely used in AI.",
    "The python snake can grow up to 20 feet long.",
    "Java coffee beans are imported from Indonesia.",
    "Java programming requires understanding of object-oriented concepts.",
    "Orange juice sales increased during winter months.",
    "Orange County reported new housing developments.",
];

// convert them into langchain documents
const documents = chunks.map((chunk, index) => ({
    pageContent: chunk,
    metadata: { id: (index + 1).toString() },
}));

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});

const vectorStore = new Chroma(embeddings, {
    collectionName: "a-test-collection",
    chromaCloudAPIKey: process.env.CHROMA_API_KEY,
    clientParams: {
        host: "api.trychroma.com",
        port: 8000,
        ssl: true,
        tenant: process.env.CHROMA_TENANT,
        database: process.env.CHROMA_DATABASE,
    },
});

await vectorStore.addDocuments(documents, { ids: documents.map((doc) => doc.metadata.id) });

const vectorRetriever = vectorStore.asRetriever({ k: 3 });

const test_query = "purchase cost 7.5 billion";

const retrieved_chunks = await vectorRetriever.invoke(test_query);

console.log("Retrieved Chunks:", retrieved_chunks);
```
Output:
```
Retrieved Chunks: [
  Document {
    pageContent: 'The tech giant acquired the code repository platform for software development.',
    metadata: { id: '6' },
    id: '6'
  },
  Document {
    pageContent: 'Microsoft acquired GitHub for 7.5 billion dollars in 2018.',
    metadata: { id: '1' },
    id: '1'
  },
  Document {
    pageContent: "NVIDIA's data center revenue reached $47.5 billion annually.",
    metadata: { id: '21' },
    id: '21'
  }
]
```
### How Vector Store Retriever is different from Similarity search?
Both use the same underlying vector search, but the retriever is a higher-level abstraction with a standard interface and extra behavior, while similaritySearch is just a raw vector-store method.
- `similaritySearch` (or `similarity_search`) is a method on the vector store itself that runs a nearest‑neighbors query and returns the top‑k similar `Documents` (or `Document`+score) for a given text

- A vector store retriever (e.g. `vectorStore.asRetriever()` / `VectorStoreRetriever`) wraps that store behind the generic `Retriever` interface, exposing `.invoke(query)` / `getRelevantDocuments(query)` and hiding store-specific details.

- retriever provide extra behaviors like:
    - `searchType` options (`"similarity"`, `"mmr"`, recursive similarity, etc.).
    - Standard `.invoke()`, `.batch()`, etc., consistent with other retriever types.

> [click here](https://docs.langchain.com/oss/javascript/integrations/retrievers#all-retrievers) to see all available retriever in JS

> [click here](https://docs.langchain.com/oss/python/integrations/retrievers#all-retrievers) to see all available retriever in python

### MMR (Maximum Margin Relevance)

MMR is a information retrieval algorithm design to reduce redundancy in the retrieved result while maintaining high relevance to the query

#### Why MMR is needed
Normal similarity search:
- Returns the most similar documents
- Problem: results can be repetitive
> MMR selects documents that are highly relevant to the query while being different from already selected documents.

#### Example
Assume your query:
```
"What is LangChain?"
```
Your vector store has these chunks:
1. "LangChain is a framework for LLM applications"
2. "LangChain helps connect LLMs with external data"
3. "LangChain is a framework for building LLM apps" 
4. "Pinecone is a vector database used with LangChain"

> chunk 1 and chunk 3 is similar

Without MMR (Similarity Search) You might get:
- #1
- #3
- #2

Repetitive information

With MMR You might get:
- #1 (core definition)
- #2 (use case)
- #4 (related ecosystem)

```js
const vectorRetriever = vectorstore.asRetriever({
  searchType: "mmr",    // by default is it set as "similarity" i.e, similarity search
  searchKwargs: {
    k: 3,
    lambdaMult: 0.5     // how randomly to pick different result
  }
});
```
> make sure your vector db support MMR

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
# Messages
> messages only work with chat models

Messages are the fundamental unit of context for models in LangChain. 

They represent the input and output of models, carrying both the content and metadata needed to represent the state of a conversation when interacting with an LLM.

Messages are objects that contain:
- **Role** - Identifies the message type (e.g. system, user)
- **Content** - Represents the actual content of the message (like text, images, audio, documents, etc.)
- **Metadata** - Optional fields such as response information, message IDs, and token usage

> LangChain provides a standard message type that works across all model providers, ensuring consistent behavior regardless of the model being called. 

###  Text prompts
Text prompts are strings - ideal for straightforward generation tasks where you don’t need to retain conversation history.
```js
const response = await model.invoke("Write a haiku about spring");
```
Use text prompts when:
- You have a single, standalone request
- You don’t need conversation history
- You want minimal code complexity

### Message prompts
Alternatively, you can pass in a list of messages to the model by providing a list of message objects.
```js
import { SystemMessage, HumanMessage, AIMessage } from "langchain";

const messages = [
  new SystemMessage("You are a poetry expert"),
  new HumanMessage("Write a haiku about spring"),
  new AIMessage("Cherry blossoms bloom..."),
];
const response = await model.invoke(messages);
```
#### Dictionary format
You can also specify messages directly in OpenAI chat completions format.
```js
const messages = [
  { role: "system", content: "You are a poetry expert" },
  { role: "user", content: "Write a haiku about spring" },
  { role: "assistant", content: "Cherry blossoms bloom..." },
];
const response = await model.invoke(messages);
```
Use message prompts when:
- Managing multi-turn conversations
- Working with multimodal content (images, audio, files)
- Including system instructions

### Message types
- **System message** - Tells the model how to behave and provide context for interactions
- **Human message** - Represents user input and interactions with the model

- **AI message** - Responses generated by the model, including text content, tool calls, and metadata
-  **Tool message** - Represents the outputs of tool calls

### System Message
A SystemMessage represent an initial set of instructions that primes the model’s behavior. You can use a system message to set the tone, define the model’s role, and establish guidelines for responses.

Example
```js
import { SystemMessage, HumanMessage } from "langchain";

const systemMsg = new SystemMessage(`
You are a senior TypeScript developer with expertise in web frameworks.
Always provide code examples and explain your reasoning.
Be concise but thorough in your explanations.
`);

const messages = [
  systemMsg,
  new HumanMessage("How do I create a REST API?"),
];
const response = await model.invoke(messages);
```
###  Human Message
A HumanMessage represents user input and interactions. They can contain text, images, audio, files, and any other amount of multimodal content.

Example of Text content
```js
const response = await model.invoke([
  new HumanMessage("What is machine learning?"),
]);
```
OR
```js
const response = await model.invoke("What is machine learning?");
```

Message metadata

```js
const humanMsg = new HumanMessage({
  content: "What is Langchain?",
  name: "alice",
  id: "msg_123",
});
```
### AI Message
An AIMessage represents the output of a model invocation. They can include multimodal data, tool calls, and provider-specific metadata that you can later access.
```js
const response = await model.invoke("Explain AI");
console.log(typeof response);  // AIMessage
```
AIMessage objects are returned by the model when calling it, which contains all of the associated metadata in the response.

Sometimes it is helpful to manually create a new AIMessage object and insert it into the message history as if it came from the model.
```js
import { AIMessage, SystemMessage, HumanMessage } from "langchain";


const messages = [
  new SystemMessage("You are a helpful assistant"),
  new HumanMessage("Can you help me?"),
  new AIMessage("I'd be happy to help you with that question!"),  // Insert as if it came from the model
  new HumanMessage("Great! What's 2+2?")
]

const response = await model.invoke(messages);
```

#### Token usage
An `AIMessage` can hold token counts and other usage metadata in its `usage_metadata` field:
```js
import { initChatModel } from "langchain";

const model = await initChatModel("gpt-5-nano");

const response = await model.invoke("Hello!");
console.log(response.usage_metadata);
```
output:
```js
{
  "output_tokens": 304,
  "input_tokens": 8,
  "total_tokens": 312,
  "input_token_details": {
    "cache_read": 0
  },
  "output_token_details": {
    "reasoning": 256
  }
}
```
### Message content
- You can think of a message’s content as the payload of data that gets sent to the model. 

- Messages have a content attribute that is loosely-typed, supporting strings and lists of untyped objects (e.g., dictionaries). 
- Separately, LangChain provides dedicated content types for text, reasoning, citations, multi-modal data,  and other message content. 
- LangChain chat models accept message content in the content attribute.
- This may contain either:
    - A string
    - A list of content blocks in a provider-native format
    - A list of LangChain’s standard content blocks

#### example 
```js
const message = {
  role: "user",
  content: [
    {
      type: "text",
      text: "Explain RAG in simple terms."
    }   // you can pass multiple content block each carrying different payload
  ]
};
```
### Multimodal
Multimodality refers to the ability to work with data that comes in different forms, such as text, audio, images, and video. 
```js
// for images
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this image." },
    {
      type: "image",
      source_type: "url",
      url: "https://example.com/path/to/image.jpg"
    },
  ],
});
```
```js
// for pdf
const message = new HumanMessage({
  content: [
    { type: "text", text: "Describe the content of this document." },
    {
      type: "file",
      source_type: "base64",
      data: "AAAAIGZ0eXBtcDQyAAAAAGlzb21tcDQyAAACAGlzb2...",
    },
  ],
});
```

[Go To Top](#content)

---
