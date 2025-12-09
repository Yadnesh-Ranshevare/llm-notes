# Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Document Loaders](#document-loaders)
4. [Text splitters](#text-splitters)
5. [Embedding models](#embedding-models)
6. [Vector Stores](#vector-stores)
7. [Integrating with Gemini](#integrating-with-gemini)
8. [Unstructured Chunking](#unstructured-chunking)

> for this tutorial wi'll be using Gemini api key (free api key)
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
# Unstructured Chunking
Unstructured chunking in LangChain uses the UnstructuredLoader to partition documents into semantic elements (like paragraphs, tables, images) before grouping them into chunks, 

### Example:
look at the following image it shows how different element on each page

<img src="../images/Image atomic element.png" style="width:500px">

### How It Works
- we use unstructured io for partition the file into an atomic element
- we group the element by titles\
from one title element to the next title element all of the element are in one group
- we call each group as CompositeElement which consists of multiple single elements
- each compositeElement is our one chunk

### How to handle Images and tables
- unlike paragraph which we can directly stored in vector db for similarity search, images and table are needed to be handled separately
- in unstructured io we get img in base64 format and table in html format
- we need information in raw text format because embedding is done on text content
- if we perform embedding on base64 img or html table we will decrease the performance of similarity search
- Therefor we use LLM to convert this img_base64 and html table into raw text format 
- now once we get the our whole info in text format we perform embedding

### How to Retrieve the original info
- even though we have updated the information at the time of embedding, we still need to send the original info to LLM 
- to do that we store the original content (base64 img, html tables) in metadata
- at the time of LLM call(when we are answering users query) we send the actual data using this stored metadata 

### Flowchart
<img src="../images/unstructured_chunking_flow.png" style="width:800px">

>here, each enhanced chunk will carry the AI enhanced text with its original information (original atomic elements) present inside the metadata

### Algorithm
1. perform the partitioning of the original document using unstructured io
2. use `chunk_by_title` to chunk the multiple partitions
3. separate out the original information:
    - text: as a original text
    - img: its base64 format
    - table: its html code
4. use LLM to find the enhanced summary of the original chunk
    > only perform this step if we have img or table inside the combined chunk
5. set page content as enhanced summary (or original text if we didn't compute the enhanced one ) and metadata as separated original information 


## Step 1: perform the partitioning of the original document using 
#### 1. install dependencies
```bash
npm i unstructured-client
```
#### 2: Create the new object of the `unstructured-client`
```js
import { UnstructuredClient } from "unstructured-client";

const client = new UnstructuredClient({
    serverURL: "https://api.unstructuredapp.io/general/v0/general", // partition endpoint
    security: {
        apiKeyAuth: process.env.VALID_API_KEY,
    },
});
```
#### 3: Read your files
```js
import fs from "fs/promises";

const filepath = "./src/UnstructuredChunking/unstructured.pdf"; // from root of the project

const fileBuffer = await fs.readFile(filepath);
const fileName = path.basename(filepath);
```
#### 4: use `unstructured-client` object to perform partitioning
```js
const response = await client.general.partition({
    partitionParameters: {
        files: {
            content: fileBuffer,
            fileName: fileName,
        },
        strategy: Strategy.Auto, 
    },
});
```

## Step 2: use `chunk_by_title` to chunk the multiple partitions
 You can also perform `chunk_by_title` at the time of partitioning
```js
const response = await client.general.partition({
    partitionParameters: {
        files: {
            content: fileBuffer,
            fileName: fileName,
        },
        strategy: Strategy.Auto, 
        chunkingStrategy: "by_title"
    },
});
```
> Use one of the supported strategies to chunk the returned elements after partitioning. When no chunking strategy is specified, no chunking is performed and any other chunking parameters provided are ignored. Supported strategies: `basic`, `by_title`, `by_page`, and `by_similarity`

You can also pass other parameters as follow
```js
const response = await client.general.partition({
    partitionParameters: {
        files: {
            content: fileBuffer,
            fileName: fileName,
        },
        extractImageBlockTypes: ["Image"],  //  use in extracting image blocks as Base64 encoded data stored in element metadata fields 
        strategy: Strategy.Auto, 
        chunkingStrategy: "by_title",
        maxCharacters: 3000,    //  Default: 500
        newAfterNChars: 2400,   // Applies only when the chunking strategy is specified.
        combineUnderNChars: 500,    //combines small chunks until of n characters
    },
});
```
> visit [unstructured io](https://docs.unstructured.io/api-reference/partition/api-parameters) official doc to see all available parameters

Now if you console.log response you'll get array of: 
```
{
  type: 'CompositeElement',
  element_id: 'be54085acc330c8511b046b7d4b44e80',
  text: '3.1 Encoder and Decoder Stacks\n' +
    '\n' +
    'Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The ﬁrst is a multi-head self-attention mechanism, and the se
    .
    .
    .
     'Decoder: The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack. Similar to the encoder, we employ residual connections around each of the sub-layers, followed by layer normalization. We also modify the self-attention sub-layer in the decoder stack to prevent positions from attending to subsequent positions. This masking, combined with fact that the output embeddings are offset by one position, ensures that the predictions for position i can depend only on the known outputs at positions less than i.',
  metadata: {
    filetype: 'application/pdf',
    languages: [ 'eng' ],
    page_number: 2,
    orig_elements: 'eJzsvFmzo8iWJvpXws4rlck8tdl9YBAgQIwSINW9VsY8ChAztPV/v86OyOGczHN7uF1V+dA7LCKE477cfY3fWu7a//pf/5Y26Tttp38rk7/9l29/o9k0JSKE+AnNMvwnAsGynxgqS36imYSiGToJUzz52798+9s7ncIknEIw5r/+Le66ISnbcErHr+cm3Lt5+rciLfNiAi0YhiBgzI/mtUymArSi9Fdr35XtdI7713/FWOZn5l++oQyL/Yz/P//y7dcGFkN+Rs8GGsF/Jv+s4fsQ0PK3cR+n9H3uxSq3tHH7ME7/9t/AiySd0ngqu/bf4iYcx3/rhy4C3ZCfWRwjMNAhK5t02vv0a6x1+9vXktt8DvOvff3r39I2/9s5RQ9a/q2d31E6nLs7iU/pdu70b/jP6LdLG3dJOnwL2+SbmH7/7E5hXI8nyV9muJdT87WwfxQBgSIJQoSA53GE/kTgCP1
    .
    .
    .
    3uLprs1Bvv0guG2bAgWRwuy72IGdArHDQM0Yjcb/jOY/iBwwCejeuz1GXeGz78rKgsh+xvvzvWZB0gH9g44lIBrnVk7DX4oK8gDhKw/owLsvLWOFoVvgnP/CrEhMC8Aj/nF9v6cMTAAugvTMYf5eIb/jbWVNTrxxUgV4G2jOd6pExThLee+V8liZpQC4SUmC'... 77432 more characters,
    filename: 'unstructured.pdf'
  }
}
```
> `orig_elements` is a base64 format of original atomic elements

## Step 3: separate out the original information:
```js
for (const [idx, res] of response.entries()) {
    console.log(`---- Chunk ${idx + 1} ----`);
    const content_types = separate_content_types(res);

    console.log(`Tables Found: ${content_types.table.length}`);
    console.log(`Images Found: ${content_types.image.length}`);
}
```
## Step 4: use LLM to find the enhanced summary of the original chunk
> only perform if we have table or image 
```js
for (const [idx, res] of response.entries()) {
    console.log(`---- Chunk ${idx + 1} ----`);
    const content_types = separate_content_types(res);

    console.log(`Tables Found: ${content_types.table.length}`);
    console.log(`Images Found: ${content_types.image.length}`);

    let EnhancedSummary = null;

    if (content_types.table.length > 0 || content_types.image.length > 0) {
        console.log("Creating AI-Enhanced Summary...");
        try {
            const ai_summary = await create_ai_enhanced_summary(content_types.text, content_types.table, content_types.image);
            EnhancedSummary = ai_summary;
            console.log("AI-Enhanced Summary:", ai_summary);
        } catch (error) {
            console.log("❌ Error generating AI summary:", error);
        }
    }
}
```
## Step 5: set page content as enhanced summary (or original text if we didn't compute the enhanced one ) and metadata as separated original information 
```js
for (const [idx, res] of response.entries()) {
    console.log(`---- Chunk ${idx + 1} ----`);
    const content_types = separate_content_types(res);
    console.log(`Tables Found: ${content_types.table.length}`);
    console.log(`Images Found: ${content_types.image.length}`);

    let EnhancedSummary = null;

    if (content_types.table.length > 0 || content_types.image.length > 0) {
        console.log("Creating AI-Enhanced Summary...");
        try {
            const ai_summary = await create_ai_enhanced_summary(content_types.text, content_types.table, content_types.image);
            EnhancedSummary = ai_summary;
            console.log("AI-Enhanced Summary:", ai_summary);
        } catch (error) {
            console.log("❌ Error generating AI summary:", error);
        }
    }

    langchain_document.push(    // each chunk document
        new Document({
            pageContent: EnhancedSummary ? EnhancedSummary : content_types.text,
            metadata: {
                original_content: {
                    table: [...content_types.table],
                    image: [...content_types.image],
                    text: [...content_types.text],
                },
            },
        })
    );
}
```
## Code:
```js
import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/sdk/models/shared";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";
import { Document } from "@langchain/core/documents";

const client = new UnstructuredClient({
    serverURL: "https://api.unstructuredapp.io/general/v0/general", // or a hard-coded URL
    security: {
        apiKeyAuth: process.env.VALID_API_KEY,
    },
});

const filepath = "./src/UnstructuredChunking/unstructured.pdf";

const fileBuffer = await fs.readFile(filepath);
const fileName = path.basename(filepath);

const response = await client.general.partition({
    partitionParameters: {
        files: {
            content: fileBuffer,
            fileName: fileName,
        },
        extractImageBlockTypes: ["Image"],
        strategy: Strategy.Auto, 
        chunkingStrategy: "by_title",
        maxCharacters: 3000,
        newAfterNChars: 2400,
        combineUnderNChars: 500,
    },
});

const langchain_document = [];

for (const [idx, res] of response.entries()) {
    console.log(`---- Chunk ${idx + 1} ----`);
    const content_types = separate_content_types(res);
    console.log(`Tables Found: ${content_types.table.length}`);
    console.log(`Images Found: ${content_types.image.length}`);

    let EnhancedSummary = null;

    if (content_types.table.length > 0 || content_types.image.length > 0) {
        console.log("Creating AI-Enhanced Summary...");
        try {
            const ai_summary = await create_ai_enhanced_summary(content_types.text, content_types.table, content_types.image);
            EnhancedSummary = ai_summary;
            console.log("AI-Enhanced Summary:", ai_summary);
        } catch (error) {
            console.log("❌ Error generating AI summary:", error);
        }
    }

    langchain_document.push(
        new Document({
            pageContent: EnhancedSummary ? EnhancedSummary : content_types.text,
            metadata: {
                original_content: {
                    table: [...content_types.table],
                    image: [...content_types.image],
                    text: [...content_types.text],
                },
            },
        })
    );
}
```

## How to separate out original information

#### 1: get each composite element
```js
function separate_content_types(elements) {     // element = single composite element
    
}
```
#### 2: get its `orig_elements` and convert it from base64 to string
```js
import zlib from "zlib";

function separate_content_types(elements) {     // element = single composite element
    const org_element = elements.metadata.orig_elements;    // orig_elements contain each single atomic element in base64 format
    const buffer = Buffer.from(org_element, "base64");
    const decompressed = zlib.inflateSync(buffer);
    const data = JSON.parse(decompressed.toString());   // array of original atomic elements
}
```

#### 3: Check whether we have any image or table inside those atomic element
```js
import zlib from "zlib";

function separate_content_types(elements) {
    const org_element = elements.metadata.orig_elements;
    const buffer = Buffer.from(org_element, "base64");
    const decompressed = zlib.inflateSync(buffer);
    const data = JSON.parse(decompressed.toString());

    data.forEach((element) => {
        if (element.type === "Image") { // make sure this string matches with our response object
            // image present
        }
        if (element.type === "Table") { // make sure this string matches with our response object
            // table present
        }
    });
}
``` 
#### 4: separate out the original text, original base64 image and html table
```js
import zlib from "zlib";

function separate_content_types(elements) {
    const content_types = {
        text: elements.text,    // at the time of chunk by title unstructured io merge the all text content
        table: [],  // contains all the available tables
        image: [],  // contains all the available images
        type: ["text"], // to check whether table/images exit or not
    };

    const org_element = elements.metadata.orig_elements;
    const buffer = Buffer.from(org_element, "base64");
    const decompressed = zlib.inflateSync(buffer);
    const data = JSON.parse(decompressed.toString());

    data.forEach((element) => {
        if (element.type === "Image") {
            content_types.image.push(element.metadata.image_base64);    // make sure this matches with our response object
            content_types.type.push("image");
        }
        if (element.type === "Table") {
            content_types.table.push(element.metadata.text_as_html);    // make sure this matches with our response object
            content_types.type.push("table");
        }
    });

    return content_types;
}
```
## How to generate AI enhanced summary
#### 1: accept the text, table or images
```js
async function create_ai_enhanced_summary(text, table, image) {
    // logic here
}
```
#### 2: initiate your LLM
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function create_ai_enhanced_summary(text, table, image) {
    const llm = new ChatGoogleGenerativeAI({
        model: "models/gemini-2.5-flash",
        apiKey: process.env.API_KEY,
    });
}
```
#### 3: add text and table into your prompt

```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function create_ai_enhanced_summary(text, table, image) {
    const llm = new ChatGoogleGenerativeAI({
        model: "models/gemini-2.5-flash",
        apiKey: process.env.API_KEY,
    });

    let prompt_text = `${text}`     // adding text 

    if (table.length > 0) {
        table.forEach((tbl, index) => {
            prompt_text += `Table ${index + 1}:\n${tbl}\n`; // adding tables
        });
    }
}
```
#### 4: attach images to the prompt
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function create_ai_enhanced_summary(text, table, image) {
    const llm = new ChatGoogleGenerativeAI({
        model: "models/gemini-2.5-flash",
        apiKey: process.env.API_KEY,
    });

    let prompt_text = `${text}`;

    if (table.length > 0) {
        table.forEach((tbl, index) => {
            prompt_text += `Table ${index + 1}:\n${tbl}\n`;
        });
    }

    // attaching images
    const message_content = [{ type: "text", text: prompt_text }];
    image.forEach((img) => {
        message_content.push({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${img}` },
        });
    });
}
```
> `data:image/jpeg;base64,${img}` this url generate the png files from base64 format of image
#### 5: invoke your LLM to generate the enhanced summary
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import "dotenv/config";

async function create_ai_enhanced_summary(text, table, image) {
    const llm = new ChatGoogleGenerativeAI({
        model: "models/gemini-2.5-flash",
        apiKey: process.env.API_KEY,
    });

    let prompt_text = `${text}`;

    if (table.length > 0) {
        table.forEach((tbl, index) => {
            prompt_text += `Table ${index + 1}:\n${tbl}\n`;
        });
    }

    const message_content = [{ type: "text", text: prompt_text }];

    image.forEach((img) => {
        message_content.push({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${img}` },
        });
    });

    const message = new HumanMessage({
        content: message_content,
    });

    const result = await llm.invoke([message]);

    return result.content;
}
```
#### 5: do some prompt engineering to get some better results
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function create_ai_enhanced_summary(text, table, image) {
    const llm = new ChatGoogleGenerativeAI({
        model: "models/gemini-2.5-flash",
        apiKey: process.env.API_KEY,
    });

    let prompt_text = `You are creating a searchable description for document content retrieval.
                CONTENT TO ANALYZE:
                TEXT CONTENT:
                ${text}`;

    if (table.length > 0) {
        prompt_text += "Tables:\n";

        table.forEach((tbl, index) => {
            prompt_text += `Table ${index + 1}:\n${tbl}\n`;
        });

        prompt_text += `
        YOUR TASK:
        Generate a comprehensive, searchable description that covers:
        1. Key facts, numbers, and data points from text and tables
        2. Main topics and concepts discussed  
        3. Questions this content could answer
        4. Visual content analysis (charts, diagrams, patterns in images)
        5. Alternative search terms users might use
        Make it detailed and searchable - prioritize findability over brevity.
        SEARCHABLE DESCRIPTION:
        `;
    }

    const message_content = [{ type: "text", text: prompt_text }];

    image.forEach((img) => {
        message_content.push({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${img}` },
        });
    });

    const message = new HumanMessage({
        content: message_content,
    });

    const result = await llm.invoke([message]);

    return result.content;
}
```
## Complete code
[click here!](./src/UnstructuredChunking/Chunking.js) to check out the original code

[Go To Top](#content)

---