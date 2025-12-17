# Content:
1. [Models](#models)
2. [Open Source Models](#open-source-models)
3. [Prompts](#prompts)
    - [prompt Template](#prompts-template)
    - [Chat Prompt Template](#chat-prompt-templates)
    - [Message Placeholder](#message-placeholder)
4. [Structured Output](#structured-output)
    - [withStructuredOutput()](#withstructuredoutput)
    - [Output Parsers](#output-parsers)
5. [Chains](#chains)
6. [Runnable](#runnable)
    - [RunnableLambda](#runnablelambda)
    - [RunnableSequence](#runnablesequence)
    - [RunnableParallel](#runnableparallel)
    - [RunnableMap](#runnablemap)
    - [RunnableBranch](#runnablebranch)
    - [RunnablePassthrough](#runnablepassthrough)
7. [Tools](#tools)
8. [Tool Calling](#tool-calling)


---
# Models

The model component in Langchain is the crucial part of the framework, designed to facilitate interaction with various `language model` and `embedding model`

it abstract the complexity of working directly with LLM's, chat models and embedding models, providing a uniform interface to communicate with them.

this makes it easier to build application that rely on AI-generated text, text embedding for similarity search and retrieval-augmented-generator(RAG)

### type of models in langchain
1. **language model:**\
models that takes text as an input and return text as output

    different type of language models:
    1. LLM's
    2. chat model

2. **embedding model:**\
models that take text as a input and return its vector embedding

### Language models
language models are AI system designed to process, generate and understand natural language text

type of language models:
#### 1.  LLM:
general purpose models that is used fo raw text generation. they take a string or plain text as input and return a string. these ae traditional older models and root used much now


**general purpose models**: models used for text summarization, text generation, code generation, question answering, etc

> normally **cannot** use a [message-based chat](./Readme_For_RAG.md/#messages) format with a raw LLM.

**Example**
```js
import { ChromeAI } from "@langchain/community/experimental/llms/chrome_ai";

const model = new ChromeAI({
  temperature: 0.5, // Optional, defaults to 0.5
  topK: 40, // Optional, defaults to 40
});

const response = await model.invoke("Write me a short poem please");
```
output:
> as it is a llm model it will only return the string output
```
  In the realm where moonlight weaves its hue,
  Where dreams and secrets gently intertwine,
  There's a place of tranquility and grace,
  Where whispers of the night find their place.

  Beneath the canopy of starlit skies,
  Where dreams take flight and worries cease,
  A haven of tranquility, pure and true,
  Where the heart finds solace, finding dew.

  In this realm where dreams find their release,
  Where the soul finds peace, at every peace,
  Let us wander, lost in its embrace,
  Finding solace in this tranquil space.
```
#### 2. chat models:
language models that are specialized for conversational task. They take a sequence of message as input and return chat message as output. these are traditional newer models and used in comparison to LLM's

> chat models are designed to use the [message object](./Readme_For_RAG.md/#messages) format.


**Example** 
```js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",   // this is a chat model just replace it with LLM model to use LLM models
    apiKey: process.env.API_KEY,
});

const response = await llm.invoke("Explain LangChain in one line.");
console.log(response);
```
Output:
> as this is a chat modal we have output in Structured [Message object](./Readme_For_RAG.md/#messages) format with role and content
```
AIMessage {
  "content": "LangChain is a framework for building sophisticated applications by connecting large language models (LLMs) with external data sources, tools, and memory.",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "__gemini_function_call_thought_signatures__": {}
  },
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 8,
      "completionTokens": 28,
      "totalTokens": 914
    },
    "finishReason": "STOP",
    "index": 0
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 8,
    "output_tokens": 28,
    "total_tokens": 914
  }
}
```
#### Difference

| Feature      | LLM                     | Chat Model                                    |
| ------------ | ----------------------- | --------------------------------------------- |
| Purpose      | General text prediction | Multi-turn interactive conversation           |
| Training     | Base training           | Base + instruction-tuning + conversation data |
| Output style | Raw, unstructured text  | Structured, helpful, conversational           |
| Example      | GPT-base                | ChatGPT-style models  


### Embedding Models
Embedding models transform raw text—such as a sentence, paragraph, or tweet—into a fixed-length vector of numbers that captures its semantic meaning.

These vectors allow machines to compare and search text based on meaning rather than exact words.


How it works
1. **Vectorization** — The model encodes each input string as a high-dimensional vector.
2. **Similarity scoring** — Vectors are compared using mathematical metrics to measure how closely related the underlying texts are.

#### Embedding single user query

```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});

const query = "What is LangChain?";
const queryVector = await embeddings.embedQuery(query);
console.log("Query embedding", queryVector);
```
output:
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

#### Embedding multiple documents

```js
import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});

const documents = [
    "LangChain is a framework for developing applications powered by language models.",
    "It enables developers to build robust and scalable LLM applications with ease.",
    "LangChain uses a combination of Python and OpenAI's API to power its features, making it a versatile tool for building LLM applications."
]

const docVectors = await embeddings.embedDocuments(documents);
console.log("document embedding:", docVectors);
```
output:
```
document embedding: [
  [
     -0.025252711, -0.005841723,   -0.08637043,   0.015319621,  0.019681364,
      0.006650677,  0.026707381,   -0.05012985, 0.00022688504,  0.033392098,
     -0.052514374, -0.055602726,  -0.046066362,  -0.016458852, -0.025696307,
      0.074742936, 0.0074665654,  -0.031139221,  -0.031337522,   -0.0179121,
      -0.06494881, -0.021615831, -0.0071363356,   0.033981375,  0.046125155,
    ... 668 more items
  ],
  [
      -0.018833516,  -0.042813454,   -0.03732912,  0.0070917206,
      -0.011072746, -0.0016123605,   0.046765387,   -0.05612219,
     -0.085164756, 0.00048469624,   0.054156244,  -0.015433041,
      -0.016707247,   0.010700463,  -0.028256357,  -0.056880727,
      -0.041733343,   0.004783783, 0.00015790024,    0.07679445,
    ... 668 more items
  ],
  [
     -0.007862462, -0.0067072334,    -0.07160114, -0.0012777768,
      0.033984505,   0.013555115,     0.04723902,  -0.057539485,
     -0.023760118,   0.044406656,    0.022177925,   0.025573542,
     -0.024441577,  0.0014495819,     0.07240967,  0.0071274787,
     -0.005427959,  -0.029124971,   -0.024638398,  -0.050623003,
      -0.00445611,  -0.017107295,    0.009175083,   0.057699982,
    ... 668 more items
  ]
]
```


[Go To Top](#content)

---
# Open Source Models
open source models are freely available AI models that can be downloaded, modified, fine tunned and deployed without restriction from a central provider.

Unlike closed source models such as OpenAI's GPT-4, Anthropic's Claude, or Google Gemini, open source models allow full control and customization
### Why developers choose open-source models over closed-source models
| Reason                  | What It Means                                                         | Why It Matters                                                             |
| ----------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Full control**        | You can download, run locally, modify, and deploy the model anywhere. | No dependency on a single company's API, limits, or pricing.               |
| **Zero API costs**      | Self-hosting removes per-request and token fees.                      | Costs stay fixed even when usage scales.                                   |
| **Complete privacy**    | All data stays on your own devices or internal servers.               | Suitable for enterprise, medical, financial, or internal apps.             |
| **Custom fine-tuning**  | You can train the model on your own data or style.                    | Better domain performance and behavior control.                            |
| **Offline usage**       | Works without internet and can run on local or even mobile hardware.  | Reliable in remote, secure, or restricted environments.                    |
| **Community ecosystem** | The model improves through community contributions and rapid updates. | Faster innovation, bug fixes, and optimizations compared to closed models. |

### When not to use open models

Despite the benefits, open models aren’t always better:
- They may be less powerful for deep reasoning
- They require more hardware
- They need DevOps to deploy and scale
- They lack capabilities like:
    - proprietary tools
    - deep thinking
    - advanced safety layers
> For highest-level reasoning or multimodal abilities, closed models often win.

### Where to find open source models

HuggingFace: The largest repository fo open source LLM's

What you get:\
Thousands of models—LLMs, vision models, embeddings, fine-tuned variants.\
Why it’s used: Easy downloads, good docs, community support, hosting options.

> for more info visit https://huggingface.co/


[Go To Top](#content)

---
# Prompts
prompts are the given instructions or queries to a model to guide its output

### Example
```js
const prompt = "Explain LangChain in one line."     // this is a prompt
const response = await llm.invoke(prompt);
```

### Type of prompts
1. text based prompts: prompts that are in text format
2. multimodeal prompts: giving something other than text as a prompt like image, sound, video, etc. 

### Static Prompts vs Dynamic Prompts

#### 1. Static Prompts
A static prompt is a fixed, unchanging instruction.
You write it once, and it stays the same every time the model is used.

No matter who uses it or what time it is, the wording remains the same.

Example:
```js
const prompt = "Explain LangChain in one line."     // this prompt is fixed
const response = await llm.invoke(prompt);
```
#### 2. Dynamic Prompts
A dynamic prompt changes based on context, variables, or user input.
You generate part of the prompt on the fly.

Example:

```js
const prompt = userInput;
model.generate(prompt);
```
If the user types:
- “Explain binary search” → prompt becomes that
- “Debug this JavaScript code” → prompt becomes that
- “Write MongoDB schema” → prompt becomes that

The prompt is not fixed, so it’s dynamic.

### Prompts template
A prompt template is a pre-structured prompt that contains fixed text (static parts) plus placeholders (dynamic parts) that get filled with user input or data at runtime.

Think of it like template literals in JavaScript:
```js
const prompt = `Hello ${name}, your score is ${score}`
```
The structure is fixed, but certain values change → same idea in AI prompting.

#### LangChain Example
1. Create a Prompt Template
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = new PromptTemplate({
    template: `You are a helpful assistant.
        Explain the following {language} code:
        {code}`,
    inputVariables: ["language", "code"],
});
```
2. Fill it with user data
```js
const finalPrompt = await prompt.format({
    // make sure to use same name as inputVariables
    language: "JavaScript",
    code: "function sum(a,b){ return a+b; }"
});
```
finalPrompt becomes:
```
You are a helpful assistant.
Explain the following JavaScript code:
function sum(a,b){ return a+b; }
```

### Why use LangChain Prompt Templates instead of JS string literals?
Using normal JavaScript template strings works for very small, one-off prompts.
But when you start building real AI features (chatbots, agents, RAG apps, coding tools), JS strings quickly become messy.

LangChain prompt templates solve several problems.

#### 1. Automatic Variable Injection & Validation
JS template literal:
```js
`Explain this ${language} code: ${code}`
``` 
If you forget to pass `language`, JS will silently insert `undefined` → model gets garbage

LangChain template:
```js
new PromptTemplate({
  template: "Explain this {language} code: {code}",
  inputVariables: ["language", "code"]
});
```
If you forget to pass a variable → LangChain throws an error immediately.\
This prevents broken prompts going to your model.

#### 2. Templates Become Reusable Components
With LangChain, a template becomes a reusable object.

You can reuse the same template:
- across multiple routes
- with multiple models
- inside tools
- in complex chains

JS string literals are not reusable components; they're just text.

#### 3. Works Natively With Chains, Retrievers, Memory, Tools
In LangChain, templates plug directly into:
- LLMChain
- RunnableSequence
- Agents
- Tools
- Output parsers
- RAG pipelines

JS strings do not integrate with this system.


### Chat Prompt Templates
whenever you want to pass the list of prompts as a input to a model use can use [message object](Readme_For_RAG.md/#messages)

This list will act as a message history for response generation
```js
import { SystemMessage, HumanMessage, AIMessage } from "langchain";

const messages = [
  new SystemMessage("You are a poetry expert"),
  new HumanMessage("Write a haiku about spring"),
  new AIMessage("Cherry blossoms bloom..."),
];
const response = await model.invoke(messages);
```

#### problem with message object
1. **They are not reusable:**

    You must recreate them every time.
    ```js
    messages = [
        SystemMessage(content="You are a Java tutor"),
        HumanMessage(content="Explain JVM")
    ]
    ```
    If tomorrow the role changes to Python tutor, you rewrite everything.

2. **Hard to make dynamic:**

    If your input changes, message objects become messy.
    ```js
    topic = "Promises"

    messages = [
        SystemMessage(content="You are a JavaScript tutor"),
        HumanMessage(content=f"Explain {topic}")
    ]
    ```
    > message object are use fot static prompt list

#### Chat Prompt Template solve this issue
ChatPromptTemplate is a structured way to build a list of chat messages dynamically instead of manually creating `SystemMessage`, `HumanMessage`, etc.

Example:
```js
import { ChatPromptTemplate } from "@langchain/core/prompts";

const chat_template = ChatPromptTemplate.fromMessages([
    ["system", "You are a React tutor."],
    ["human", "{question}"],
]);

const messages = await chat_template.format({
  question: "What is useState?"
});

console.log(messages);
```
Output:
```
System: You are a React tutor.
Human: What is useState?
```

### Message Placeholder
message placeholder is a special placeholder used inside a `ChatPromptTemplate` to dynamically insert the chat history or list of message at runtime

```js
import { MessagesPlaceholder, ChatPromptTemplate } from "@langchain/core/prompts";

const chatHistory = [
    {
        type: "human",
        content: "What is vector search?",
    },
    {
        type: "ai",
        content: "Vector search is a technique used to find similar items based on their vector representations.",
    },
];

const chatPrompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a coding tutor."], 
    new MessagesPlaceholder("history"), 
    ["human", "{input}"]
]);

const result = await chatPrompt.format({
    history: chatHistory, // Pass chat history array
    input: "How does vector search work?",
});
console.log(result);
```
output:
```
System: You are a coding tutor.
Human: What is vector search?
AI: Vector search is a technique used to find similar items based on their vector representations.
Human: How does vector search work?
```

[Go To Top](#content)

---
# Structured Output

Structured output allows language models to return data in a specific, predictable format. Instead of parsing natural language responses, you get typed structured data.

>language models generally returns the response in natural language

### Example
**Prompt: Can you create a one-day travel arrangements for paris**

unstructured output:
```
Here's a suggested travel arrangements:
Morning: visit the Eiffel Tower
Afternoon: walks through the Louver Museum
Evening: Enjoy dinner at a Seine riverside cafe
```

Structured Output (JSON format):
```js
[
    {
        "time":"Morning", 
        "activity":"visit the Eiffel Tower"
    },
    {
        "time":"Afternoon", 
        "activity":"walks through the Louver Museum"
    },
    {
        "time":"Evening", 
        "activity":"Enjoy dinner at a Seine riverside cafe"
    }
]
```
### Why Structured Output is useful?
Structured output is useful because your code can TRUST the LLM.\
Without it, LLM responses are unpredictable and fragile.

#### 1. Makes LLM output machine-safe
Without structure:
- Parsing text becomes hard
- Edge cases are unpredictable
- Random wording makes it difficult to handle
```
The user seems to be an admin and probably can access the dashboard.
```
Now what?
- Is admin true or false?
- What if wording changes?
- Regex breaks 

With structure:
- Fixed keys
- Known types
- Zero guessing
```js
{
  "role": "admin",
  "canAccessDashboard": true
}
```
Your code can now do:
```js
if (user.canAccessDashboard) showDashboard();
```
#### 2. Required for Agents & Tools
Agents must decide things like:
- Which tool to call
- What arguments to pass

Example:
```js
{
  "tool": "getWeather",
  "args": {
    "city": "Mumbai"
  }
}
```
Agents cannot work reliably without structured output.

#### 3. Perfect for database operations
Free text → DB (dangerous)
```
User is 22 years old and likes JS
```
Structured → DB
```js
{
  "age": 22,
  "skills": ["JS"]
}
```
Direct insert, no transformation.

### How to get structured output?
There are two ways to get the structured output from out language models
1. [`withStructuredOutput()`](#withstructuredoutput): works only when your model can return structured output
2. [`output parser`](#output-parsers): woks with both type of model, i.e, one who produce structured output and one who doesn't 

## withStructuredOutput()
1. describe your schema using zod
```js
import z from "zod";

const ActivitySchema = z.object({   // schema for each activity
  time: z.enum(["Morning", "Afternoon", "Evening"]),
  activity: z.string(),
});

const StructuredOutputSchema = z.array(ActivitySchema); // array of activities
```
2. create the unstructured model first
```js
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const unstructuredModel = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});
```
3. now use `.withStructuredOutput()` to get the structured model from unstructured one
```js
const structuredModel = unstructuredModel.withStructuredOutput(StructuredOutputSchema); // pass your schema
```
4. use this model to get the structured output
```js
const query = "Can you create a one-day travel arrangements for paris"

const response = await structuredModel.invoke(query);
```
#### Code:
```js
import z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const ActivitySchema = z.object({
    time: z.enum(["Morning", "Afternoon", "Evening"]),
    activity: z.string(),
});

const StructuredOutputSchema = z.array(ActivitySchema);

const unstructuredModel = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const structuredModel = unstructuredModel.withStructuredOutput(StructuredOutputSchema);

const query = "Can you create a one-day travel arrangements for paris";

const response = await structuredModel.invoke(query);
console.log("Structured Response:", response);
```
Output:
```js
Structured Response: [
  {
    time: 'Morning',
    activity: 'Visit the Eiffel Tower and take a walk along the Seine River.'
  },
  {
    time: 'Afternoon',
    activity: 'Explore the Louvre Museum and enjoy lunch nearby.'
  },
  {
    time: 'Evening',
    activity: 'Dine in Montmartre and visit the Sacré-Cœur Basilica for sunset views.'
  }
]
```
## Output parsers
output parsers in langchain helps convert raw LLM response into structured format like JSON, csv, etc. 

They ensure consistency, validation, and ease of use in application 

There are multiple output parser in langchain like:
1. [string output parser](#1-string-output-parser)
2. [JSON output parser](#2-json-output-parser)
3. [structured output parser](#3-structured-output-parser)\
etc...

### 1. string output parser
it is used to parse the language model response and return it in plain text format
```js
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const parser = new StringOutputParser();

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const response = await llm.invoke("Say hello");

const output = await parser.invoke(response);

console.log("Raw Response:", response);
console.log("pars Output:", output);
```
output:
```
Raw Response: AIMessage {
  "content": "Hello!",
  "additional_kwargs": {
    "finishReason": "STOP",
    "index": 0,
    "__gemini_function_call_thought_signatures__": {}
  },
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 3,
      "completionTokens": 2,
      "totalTokens": 23
    },
    "finishReason": "STOP",
    "index": 0
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "input_tokens": 3,
    "output_tokens": 2,
    "total_tokens": 23
  }
}
pars Output: Hello!
```
> actually we get the response in `response.content` block 

why to use string output parsers?

- `response.content` is model-specific\
`StringOutputParser` gives you a clean, consistent string interface
- helps in constructing easy chains
```
Prompt → LLM → OutputParser → string output → LLM → OutputParser → final output string
```
> A chain is just a pipeline where the output of one step becomes the input of the next step

### 2. JSON output parser
`JsonOutputParser` converts the LLM’s text output into a JavaScript object by parsing JSON.

in `JsonOutputParser` we send an additional instruction along with our prompt which tell model to send data in JSON format

with `JsonOutputParser` we cannot enforce the structure of our output it will be decided by LLM itself

```js
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const parser = new JsonOutputParser();

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const prompt = "give me the list of three programming languages \nin json format";

const response = await llm.invoke(prompt);

const output = await parser.invoke(response.content);

console.log("Parsed Output:", output);
```
output:
```js
Parsed Output: [ 'Python', 'JavaScript', 'Java' ]
```
### 3. Structured Output Parser
A Structured Output Parser forces the LLM to return data in a specific structure and then validates it.

Here also we send an additional instruction along with our prompt which tell model to send data in structured format

we get that instruction from `.getFormatInstructions()`

to use `StructuredOutputParser` first we need to define our schema
```js
import z from "zod";

// array of objects
const schema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
    })
);
```
then we use `StructuredOutputParser.fromZodSchema()` to construct our parser
```js
const parser = StructuredOutputParser.fromZodSchema(schema);
```
> use `parser.getFormatInstructions()` to get that additional prompt information

#### Code

```js
import z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import "dotenv/config";

const schema = z.array(
    z.object({
        id: z.number(),
        name: z.string(),
    })
);

const parser = StructuredOutputParser.fromZodSchema(schema);

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const prompt = `give me the list of three programming languages \n${parser.getFormatInstructions()}`;

const response = await llm.invoke(prompt);

const output = await parser.invoke(response.content);

console.log("Parsed Output:", output);
```
output:
```js
Parsed Output: [
  { id: 1, name: 'Python' },
  { id: 2, name: 'JavaScript' },
  { id: 3, name: 'Java' }
]
```

[Go To Top](#content)

---
# Chains
In LangChain, a chain is simply a way to connect multiple steps together so they run one after another to complete a task.

Think of it like a pipeline:\
Input → Processing → Output

in chain output of first step is given as input to next step until we get the output

in langchain `.pipe()` is LangChain's method for chaining

### Example of Basic chaining
```js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = new PromptTemplate({
    template: "Explain {topic} in simple 2 sentences.",
    inputVariables: ["topic"],
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const parser = new StringOutputParser();

const chain = prompt.pipe(llm).pipe(parser)

const result = await chain.invoke({ topic: "REST API" });
console.log(result);
```
output:
```
A REST API is a set of rules allowing different software applications to communicate with each other over the internet. It uses common web requests (like GET, POST) to retrieve or send data to specific pieces of information, called resources.
```

### Parallel Chain
parallel chains mean running multiple chains (or steps) at the same time on the same input, instead of one after another.

we use `RunnableParallel.from()` to execute the chain in parallel

#### Example:
let say we have a text article which we want to summarize into points and generate 2 questions from it and we want our final data into a single document

in sequential chains we can only perform one task at a time i.e, first generate point vise summary then generate questions and finally combine both

```
data -> generate summary -> generate question -> combine -> output
```

but in parallel chains we can generate summary and question at the same time using parallel chain
```
        ┌─> generate summary  ─┐          
data ───|                      |─────> combine -> output
        └─> generate question ─┘          
```

1. initiate parser and llm's
```js
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const parser = new StringOutputParser();
```
2. chain 1: generate point vise summary
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt1 = new PromptTemplate({
    template: "create a point wise summary of the following text:\n\n{input}",
    inputVariables: ["input"],
});

const chain1 = prompt1.pipe(llm).pipe(parser)
```
3. chan 2: generate two questions
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt2 = new PromptTemplate({
    template: "generate 2 questions from the following topic:\n\n{input}",
    inputVariables: ["input"],
});

const chain2 = prompt2.pipe(llm).pipe(parser)
```
4. run both chain 1 and chain 2 in parallel
```js
import { RunnableParallel } from "@langchain/core/runnables";

const parallelChian = RunnableParallel.from({
    summary: chain1,
    questions:chain2
})
```
when you execute this parallel chain the output you get is as follow:
```
{
  questions: 'Here are two questions generated from the provided topic:\n' +
    '\n' +
    '1.  According to the text, what are some key abilities that Artificial Intelligence allows computers to do?\n' +
    '2.  What is the main goal of AI, as described in the passage?',
  summary: "Here's a point-wise summary of the text:\n" +
    '\n' +
    '*   AI is a technology that allows computers to think and learn like humans.\n' +
    '*   It can understand language, recognize images, and make decisions based on data.\n' +
    '*   Examples include voice assistants (Siri, Alexa), Netflix recommendation systems, and chatbots.\n' +
    '*   AI is used in many fields, such as healthcare, education, banking, and transportation.\n' +
    '*   The main goal of AI is to make machines smarter to help humans work faster and better.'
}
```
4. chain 3: combine the output of parallel chain
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt3 = new PromptTemplate({
    template: "jest merge the following summary and questions into a single json object with keys 'summary' and 'questions':\n\nSummary:\n{summary}\n\nQuestions:\n{questions}",
    inputVariables: ["summary", "questions"],   // make sure this name matches with the output of parallel chains
});

const chain3 = prompt3.pipe(llm).pipe(parser)  
```
5. combine `parallelChian` with `chain3`
```js
const combinedChain = parallelChian.pipe(chain3);   // output of parallel chain will pass into chain three
```
5. invoke the combine chain:
```js
const data = `Artificial Intelligence, or AI, is a technology that allows computers to think and learn like humans.
AI can understand language, recognize images, and make decisions based on data.
Examples of AI include voice assistants like Siri and Alexa, recommendation systems on Netflix, and chatbots.
AI is used in many fields such as healthcare, education, banking, and transportation.
The main goal of AI is to make machines smarter so they can help humans work faster and better.`

const result = await combinedChain.invoke({ input: data });
```
#### Code
[click here](../Langchain/src/Chain/parallel.js) to visit the complete code


### Conditional Chains
In LangChain, a conditional chain means controlling which chain (or step) runs based on some condition 

#### Example:
lets take a user review and classify it as positive or negative
- if positive -> send a positive message to user like thank you!
- if negative -> send a proper response to help user

to implement this conditional chaining we use `RunnableBranch`
> `RunnableBranch` is LangChain’s clean, low-level way to do `if–else` logic for chains.

**syntax of `RunnableBranch`**
```js
const branch_chain = RunnableBranch.from([
    [condition1, chain1],
    [condition2, chian2],
    .
    .
    .
    defaultChian
])
```

1. classifier chain
```js
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

const schema = z.enum(["positive", "negative"]);

const json_parser = StructuredOutputParser.fromZodSchema(schema);

const prompt1 = new PromptTemplate({
    template: "classify the sentiment of the following review as positive, negative\n\n{review}\n\n{pares}",
    inputVariables: ["review"],
    partialVariables: { pares: json_parser.getFormatInstructions() },
});

const classifierChain = prompt1.pipe(llm).pipe(json_parser);
```
2. positive response chain
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt2 = new PromptTemplate({
    template: "tell one positive response to the user following sentiment:\n\n{sentiment}",
    inputVariables: ["sentiment"],  // make sure this name matches with the input object i.e, input = {sentiment = ...}
});

const positiveChain = prompt2.pipe(llm).pipe(new StringOutputParser());
```
2. negative response chain
```js
import { PromptTemplate } from "@langchain/core/prompts";

const prompt3 = new PromptTemplate({
    template: "tell one negative response to the user the following sentiment:\n\n{sentiment}",
    inputVariables: ["sentiment"],  // make sure this name matches with the input object i.e, input = {sentiment = ...}
});

const negativeChain = prompt3.pipe(llm).pipe(new StringOutputParser());
```
4. conditional branching/chaining:
```js
const generalChain = new PromptTemplate({
    template: "tell user to fill proper feedback in 1 to 2 sentences.",
    inputVariables: [],
}).pipe(llm).pipe(new StringOutputParser());

const branch_chain = RunnableBranch.from([
  [
    (input) => input.sentiment === "positive",
    positiveChain,  // in this chain we are passing input as {sentiment = "positive"}
  ],
  [
    (input) => input.sentiment === "negative",
    negativeChain, // in this chain we are passing input as {sentiment = "negative"}
  ],
  generalChain,
]);
```
5. add this `branch_chain` to  `classifierChain`
```js
const combine_chain = classifierChain.pipe(branch_chain);
```
> as `classifierChain` returns `{sentiment = ...}` this object will be the input for `branch_chain`

### Complete code
[click here](../Langchain/src/Chain/conditional.js) to visit the complete code



[Go To Top](#content)

---
# Runnable
In LangChain, a Runnable is a standardized, composable unit of work that can be executed, chained, and reused in pipelines.

Before Runnables, LangChain components (LLMs, prompts, chains, tools) were harder to combine flexibly.

Runnables unify everything so that:
- Prompts
- LLMs
- Output parsers

all behave the same way and can be chained together cleanly.

### Traditional chains
Before Runnables, LangChain used Chains as the main way to connect components.

A Chain was a predefined workflow class that:
- Took some inputs
- Called one or more components internally
- Returned outputs

You didn’t control each step directly — the chain decided the flow.

#### Example: `LLMChain`
```js
import { LLMChain } from "langchain/chains";
```
Used for:
```
Prompt → LLM → Output
```
You cannot easily inject logic in between

### Problem with traditional LangChain Chains
The problem with traditional LangChain Chains (before Runnables) is not that they didn’t work, but that they were too rigid and inconsistent for real-world apps.

#### Problem 1: Rigid, predefined structure
Traditional chains had fixed internal logic.

Example: `LLMChain`
```
Prompt → LLM → Output
```
You couldn’t easily change this order or insert steps.
>Anything extra meant writing a custom Chain class.

#### Problem 2: increasing number of chains
As apps grew, developers kept creating new Chain classes for every variation:
- `LLMChain`
- `ConversationalChain`
- `RetrievalQAChain`
- `VectorDBQAChain`\
etc...

Each solved one specific workflow.

> The number of chains grew combinatorially.


### Why traditional langchain component where hard to combine?

Earlier LangChain had separate abstractions:
- PromptTemplate
- LLM / ChatModel
- OutputParser

Each had different APIs and expectations.


#### Problem: No common interface
Before Runnables:
```js
prompt.format()      // returns string
llm.call()           // returns object
parser.parse()       // expects string
```
>Different method names, different input/output types.

You had to manually glue things together.
```js
const text = prompt.format(input);
const response = await llm.call(text);
const result = parser.parse(response.text);
```
- Boilerplate
- Easy to break
- Hard to reuse

### How Runnables fixed it (the key idea)?
Runnables introduced ONE universal interface:
```
(input) → output
```
With standard methods:
- `.invoke()`
- `.batch()`
- `.stream()`
- `.pipe()`

Now everything behaves the same.
#### Problem solved: common interface
Before Runnables:
```js
prompt.invoke()         // returns object
llm.invoke()            // returns object
parser.invoke()         // returns object
```
>Same method names, same input/output types.
now we can combine them easily
```js
const chain = prompt
  .pipe(model)
  .pipe(parser);

const final = await chain.invoke({ topic });
```
- No glue code
- Clear data flow
- Easy to extend


### Type of Runnables
1. **Task specific Runnables:** 
    - This are the core Langchain component that have been  converted into runnables so they can used in pipelines
    - example:\
    `ChatGoogleGenerativeAI` -> call gemini LLM\
    `PromptTemplate` -> create prompt template\
    etc...
2. **Runnable Primitive**
    - this are the fundamental building block for structuring execution logic in AI workflow
    - they orchestrate execution by defining how Runnable interact
    - example:\
    `RunnableParallel` -> executing runnable in parallel\
    `RunnableBranch` -> executing runnable conditionally\
    `RunnableSequence` -> executing runnable in sequence\
    etc...


[Go To Top](#content)

---
# RunnableLambda
Purpose: Turn plain JS logic into a runnable
### How plain JS code becomes a Runnable
At its core, LangChain says:\
If something can behave like `async (input) → output`, it can be a Runnable.

So plain JS functions already match this shape.
```js
(input) => output
```
LangChain just wraps them with a standard interface.

#### The wrapper: `RunnableLambda`
Plain JS function
```js
const addPrefix = (text) => `Topic: ${text}`;
```
Turn it into a Runnable
```js
import { RunnableLambda } from "@langchain/core/runnables";

const addPrefixRunnable = new RunnableLambda({
  func: addPrefix,
});

await addPrefixRunnable.invoke("LangChain");
// Topic: LangChain
```
#### Why wrapping is needed
Plain JS functions:
- Don’t know about .pipe()
- Can’t stream
- Can’t batch automatically

The wrapper adds those capabilities.

#### Automatic conversion
LangChain auto-wraps functions for you.
```js
const chain = prompt
  .pipe(model)
  .pipe((output) => output.content.toUpperCase());
```
That last function is automatically converted into a `RunnableLambda`.


[Go To Top](#content)

---
# RunnableSequence
Purpose: Run multiple steps one after another
### Example:
```js
import { RunnableSequence } from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  (x) => `Topic: ${x}`,     // output of this 
  (x) => x.toUpperCase(),   // will be given as input here
]);

await chain.invoke("runnables");
// TOPIC: RUNNABLES
```
### Mental model
```
A → B → C
```

[Go To Top](#content)

---
# RunnableParallel
Purpose: Run multiple runnables at the same time
### Example
```js
import { RunnableParallel } from "@langchain/core/runnables";

const parallel = RunnableParallel.from({
  lower: (x) => x.toLowerCase(),    // both will have same input and will run in parallel
  upper: (x) => x.toUpperCase(),    // both will have same input and will run in parallel
});

const result = await parallel.invoke("LangChain");
console.log(result);
```
### Output
```js
{
  lower: "langchain",
  upper: "LANGCHAIN"
}
```
### Mental model
```
     → A →
Input       → Results
     → B →
```


[Go To Top](#content)

---
# RunnableMap
Purpose: Transform input into a structured object
### Example
```js
import { RunnableMap } from "@langchain/core/runnables";

const map = RunnableMap.from({
  original: (x) => x + " Langchain",    // both will have same input
  length: (x) => x.length,              // both will have same input
});

const result = await map.invoke("AI");
console.log(result); 
```
### Output
```js
{
  original: "AI Langchain",
  length: 2
}
```
> Similar to RunnableParallel, but focused on shaping output

[Go To Top](#content)

---
# RunnableBranch
Purpose: Conditional execution (if/else)

### Syntax
```js
const branch_chain = RunnableBranch.from([
    [condition1, chain1],
    [condition2, chian2],
    .
    .
    .
    defaultChian
])
```
### Example
```js
import { RunnableBranch } from "@langchain/core/runnables";

const branch = RunnableBranch.from([
    [(x) => x.length < 5, (x) => "SHORT"],  // fist condition
    [(x) => x.length >= 5, (x) => "LONG"],  // second condition
    (x) => "UNKNOWN",                       // default block
]);

const result = await branch.invoke("Hello");
console.log(result);
```
### Output
```
LONG
```
### Mental model
```
if (condition) → A
else → B
```


[Go To Top](#content)

---
# RunnablePassthrough
Purpose: Pass input forward unchanged (tap/log)
### Example
```js
import { RunnablePassthrough } from "@langchain/core/runnables";

const chain = RunnablePassthrough.assign({
  length: (x) => x.input.length,
});

const result = await chain.invoke({input:"LangChain"});
console.log(result); // Output: { input: 'LangChain', length: 9 }
```
### Output
```js
{
  input: "LangChain",
  length: 9
}
```

[Go To Top](#content)

---
# Tools
A tool is just a javascript function that is packaged in a way the LLM can understands and call when needed

tools are functions or capabilities that an LLM can use to take actions or fetch information, instead of only generating text.

**Without tools** → the model only answers from its training\
**With tools** → the model can search, calculate, call APIs, query databases, run code, etc.

> Toolkit: A toolkit is just a collection of tools that serve the common purpose 
>
> example:\
> add_Operation_Tool, multiply_Operation_Tool can be combine into a collection called calculatorToolkit


### Langchain provide two type of tools
1. built in tools:\
Built-in tools are pre-made tools provided by LangChain

2. custom tools:\
Custom tools are tools YOU create for your own logic or APIs.

> [click here](https://docs.langchain.com/oss/javascript/integrations/tools/index#all-tools-and-toolkits) to check all the available built in tools for js
>
>[click here](https://docs.langchain.com/oss/python/integrations/tools/index#search) to check all the available built in  tools for python

### How Tools fits into the Agent ecosystem
An AI agent is an LLM-powered system that can automatically think, decide, and take action using external tools or API's to achieve a goal
> Think and decide -> LLM
> 
> Take action -> tools

### Example: `WikipediaQueryRun()` built in tool
```js
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const tool = new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 200,
});

const res = await tool.invoke("LangChain");

console.log(res);
```
output:
```
Page: LangChain
Summary: LangChain is a software framework that helps facilitate the integration of large language models (LLMs) into applications. As a language model integration framework, LangChain
```
### Custom Tools using DynamicTool
> must follow complete tutorial, the code bellow is incomplete to complete it follow to tutorial till the end
1. define your function
```js
function add(a, b) {
    return a + b;
}
```
2. create a tool using that function
```js
import { DynamicTool } from "@langchain/core/tools";

const addTool = new DynamicTool({
    name: "add_numbers",    // needed by LLM at time time of tool calling 
    description: "Adds two numbers together",   // needed by LLM at time time of tool calling 
    func: async (input) => {    
        const {a, b} = input    // destructure the output
        return add(a, b);   // call the function here
    },
});
```
> `func` is the method that only accepts the input in object format, that way we first destructure it

3. invoke the tool
```js
await addTool.invoke({ a: 5, b: 10 });      
```
Although this is look fine but it will not work as `DynamicTool` only takes the string input

Example:
```js
import { DynamicTool } from "@langchain/core/tools";

const addTool = new DynamicTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    func: async (input) => {
        console.log(input)  // undefined
    },
});

await addTool.invoke({ a: 5, b: 10 });
```
output:
```
undefined
```
> As `DynamicTool` takes the string input only 

Therefor to solve this issue we convert the input value into string and convert it back to JSON inside the tool
```js
import { DynamicTool } from "@langchain/core/tools";

function add(a, b) {
    return a + b;
}

const addTool = new DynamicTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    func: async (input) => {
        const { a, b } = JSON.parse(input);     // convert it back to json
        return add(a, b).toString();
    },
});

const result = await addTool.invoke(JSON.stringify({ a: 5, b: 10 }));   // convert the input into string
console.log(result);
```
output
```
15
```

### Custom tool using DynamicStructuredTool 
it is same as `DynamicTool` but unlike `DynamicTool` which accept the string input only `DynamicStructuredTool` can accept the structured input
1. define your function
```js
function add(a, b) {      
    return a + b;
}
```
2. create a tool using that function
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const addTool = new DynamicStructuredTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    schema: z.object({  // define your schema here  
        a: z.number(),
        b: z.number(),
    }),
    func: async ({ a, b }) => {
        return add(a, b);   // call the function here
    },
});
```
3. invoke the tool
```js
const result = await addTool.invoke({ a: 5, b: 10 });
```

#### Complete code
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

function add(a, b) {
    return a + b;
}

const addTool = new DynamicStructuredTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    schema: z.object({
        a: z.number(),
        b: z.number(),
    }),
    func: async ({ a, b }) => {
        return add(a, b);
    },
});

const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);
```
output
```
15
```
### Another syntax
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

// make sure that function is async function
async function add({a, b}) {      // make sure to accept the argument as a object 
    return a + b;
}

const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const addTool = new DynamicStructuredTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    schema: schema,
    func: add       // pass the function directly
});

const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);
```

### Custom tool using tool() wrapper
```js
import { tool } from "langchain"; // Creates tool automatically
import * as z from "zod";

function add({ a, b }) {
    return a + b;
}

const addTool = tool((input) => add(input), {
    name: "add_numbers",
    description: "Add two numbers",
    schema: z.object({
        a: z.number(),
        b: z.number(),
    }),
});

const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);        // 15
```
#### Difference between `DynamicStructuredTool` and `tool()`
tool() - Smart Defaults
```js
const smartTool = tool(
    ({ query }) => `Found: ${query}`,  // 1. Function (auto-parsed)
    {
        name: "search",                   // 2. Name (required)
        schema: z.object({ query: z.string() }),  // 3. Schema (required)
        // ✅ Description auto-generated from schema .describe()
        // ✅ All other fields have production defaults
    }
);
``` 
DynamicStructuredTool - Everything Explicit
```js
const explicitTool = DynamicStructuredTool.fromFunction({
    name: "search",                             // Required
    description: "Search something",            // ✅ Must manually write
    schema: z.object({ query: z.string() }),    // Required
    func: ({ query }) => `Found: ${query}`,     // Required (duplicate function)
    returnDirect: false,                        // Required (explicit default)
    parseError: undefined,                      // Required (explicit default)
    // ❌ No smart defaults - must specify everything
});
```

### BaseTool
BaseTool is the abstract parent class of all tools in LangChain.

Every tool (DynamicTool, StructuredTool, custom tools) extends BaseTool internally

#### Why BaseTool exists:
LangChain needs one common interface so agents can:
- List tools
- Decide which tool to call
- Invoke tools safely
- Validate inputs
- Track metadata

BaseTool defines that contract.

#### Custom Tool Using BaseTool
```js
import { BaseTool } from "@langchain/core/tools";
import { z } from "zod";

class AddTool extends BaseTool {
  name = "add_numbers";
  description = "Add two numbers";

  schema = z.object({
    a: z.number(),
    b: z.number(),
  });

  async _call({ a, b }) {
    return String(a + b);
  }
}
```
> BaseTool has been removed from @langchain/core/tools in recent LangChain JS versions. Therefor this code snippet will not work anymore and use it only to understand how tool woks internally 




[Go To Top](#content)

---
# Tool Calling
Tool calling in LangChain means allowing a language model (LLM) to decide when and how to use external tools (functions, APIs, databases, calculators, etc.) to complete a task instead of only generating text.

### Why tool calling is needed
LLMs are good at reasoning, but they cannot:
- Access real-time data
- Query databases
- Call APIs
- Run code reliably on their own

Tool calling lets the model delegate work to tools when needed.

### Simple illustration
User asks:\
**“What’s the weather in Mumbai right now?”**

The LLM:
1. Understands it needs real-time data
2. Chooses the weather API tool
3. Calls the tool with required parameters
4. Gets the result
5. Responds in natural language

### Tool Binding
tool binding isa step where you register a tool with LLM so that:
1. The LLM knows what tools are available
2. It knows what each tool does (via description)
3. It knows what input format to use (via schema)


### How to Bind  tool with LLM
1. create a tool
```js
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

async function multiply({ a, b }) {
    return a * b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers",
    schema: schema,
    func: multiply,
});
```
2. initialize the LLM
```js 
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});
```
3. bind the tool with LLM
```js
const llm_with_tool = llm.bindTools([multiplyTool]);
```
> You can pass multiple tools inside that array to bind multiple tools with LLm
### Complete code
```js
import "dotenv/config";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

async function multiply({ a, b }) {
    return a * b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers",
    schema: schema,
    func: multiply,
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const llm_with_tool = llm.bindTools([multiplyTool]);
```
### Tool Calling
Tool calling is the process where the LLM decides during the conversation or task, that it needed to use a specific tool and generate a structured output with:
- the name of tool
- and the argument to call it with

> LLM does not actually run the tool, it just suggest the tool and the input argument. the actual execution is handled by langchain or programmers

### Example
```js
const response1 = await llm_with_tool.invoke("Multiply 5 and 10.");
console.log("response for multiply query");
console.log(response1.content);

const response2 = await llm_with_tool.invoke("hey");
console.log("response for normal query");
console.log(response2.content);
```
output:
```
[
  {
    type: 'functionCall',
    functionCall: { name: 'multiply_numbers', args: [Object] }
  }
]
response for normal query
Hello! How can I help you today?
```
- name = name of the tool that need to be called
- args = input arguments
    ```js
    console.log(response3.content[0].functionCall.args);
    ```
    output
    ```js
    { a: 5, b: 10 }
    ```
as you can see LLM generate the structure output for calling the tool and does not call the tool directly
> it does not generate the structured tool calling output for normal user query

### Another way to check this tool calling feature
we can use `.tool_calls` to check whether we need to call any tools or not
- `.tool_calls` returns the array of tool that needed to be called, if it return an empty array then that mean there is no need to call any tool

Example:
```js
const response1 = await llm_with_tool.invoke("Multiply 5 and 10.");
console.log("response for multiply query");
console.log(response1.tool_calls);

const response2 = await llm_with_tool.invoke("hey");
console.log("response for normal query");
console.log(response2.tool_calls);
```
output
```
response for multiply query
[
  {
    type: 'tool_call',
    id: '431ec89d-d05b-4f09-b5af-4210a67a514c',
    name: 'multiply_numbers',
    args: { a: 5, b: 10 }
  }
]
response for normal query
[]
```

### Tool Execution
Tool execution is tha step where the actual code (tool) is run using the input argument that the LLM suggested during tool calling

#### Option 1: direct answer of the user query
```js
const response = await llm_with_tool.invoke("Multiply 5 and 10.");
const args = response.tool_calls[0].args
const ans = await multiplyTool.invoke(args)     // pass the arguments only
console.log(ans);   // output = 50
```

#### Option 2: Get the Tool message (a type of [message object](./Readme_For_RAG.md/#messages))

```js
const response = await llm_with_tool.invoke("Multiply 5 and 10.");
const ans = await multiplyTool.invoke(response.tool_calls[0])   // pass entire tool_calls
console.log(ans);
```
output:
```
ToolMessage {
  "content": "50",
  "name": "multiply_numbers",
  "additional_kwargs": {},
  "response_metadata": {},
  "tool_call_id": "ad27e4d1-1488-40eb-a8ae-ece7af55c47e"
}
```
we can use this tool message to generate insight using LLM

### Final code 
```js
import "dotenv/config";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

async function multiply({ a, b }) {
    return a * b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers",
    schema: schema,
    func: multiply,
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const llm_with_tool = llm.bindTools([multiplyTool]);

const query = new HumanMessage("Multiply 5 and 10.");

const messages = [query];   // maintain the chat history

const response = await llm_with_tool.invoke(messages);

messages.push(response);    // add AIresponse to history array

const ans = await multiplyTool.invoke(response.tool_calls[0]);

messages.push(ans); // add tool message to history aray

const final_ans = await llm_with_tool.invoke(messages);

console.log(final_ans.content);
```
output:
```
The result of multiplying 5 and 10 is 50.
```

[Go To Top](#content)

---
