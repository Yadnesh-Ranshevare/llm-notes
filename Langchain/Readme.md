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