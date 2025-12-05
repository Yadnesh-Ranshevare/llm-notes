# Content
1. [What is LLM](#what-is-llm)
2. [Generative Pre-Trained Transformer (GPT)](#generative-pre-trained-transformer-gpt)
3. [Tokenization and Encoding](#tokenization-and-encoding)
4. [How to retrieve tokens using JS](#how-to-retrieve-tokens-using-js)
5. [Vector Embeddings](#vector-embeddings)
6. [Positional encoding](#positional-encoding)
7. [Self Attention](#self-attention)
8. [How to inspect this vector representation of word](#how-to-inspect-this-vector-representation-of-word)
9. [How LLM generate Response](#how-llm-generate-response)
10. [Context Window](#context-window)
11. [Token Cost and Token Limits](#token-cost-and-token-limits)

---

# What is LLM
An LLM (Large Language Model) is an AI system trained on huge amounts of text so it can understand and generate human-like language. 

It learns patterns, grammar, facts, and reasoning from its training data and then uses that knowledge to answer questions, write code, summarize text, translate languages, and more.

### Illustration to make it clearer
- Imagine a massive library containing billions of sentences.
- The model “reads” the entire library during training.
- Later, when you ask a question, it doesn’t search the library—it predicts the most likely and meaningful next words based on everything it learned.

### A simple analogy
Think of it like a smart autocomplete:
- Your phone predicts the next word based on a few past messages.
- An LLM does the same but with knowledge from millions of books, articles, and websites—so its predictions are far more accurate and nuanced.

### Popular LLM Examples
- **GPT-4, GPT-5 series** – Models behind ChatGPT.
- **LLaMA (LLaMA 2, LLaMA 3)** – Meta’s open-source family of LLMs.
- **Gemini (Gemini Pro, Ultra, Nano)** – Google’s multimodal LLMs.
- **Claude (Claude 2, 3 series)** – Anthropic’s advanced reasoning models.
- **Mistral (Mistral 7B, Mixtral 8x7B, 8x22B)** – Lightweight yet powerful open models.


[Go To Top](#content)

---
# Generative Pre-Trained Transformer (GPT)
A Generative Pre-Trained Transformer (GPT) is a type of Large Language Model built using a specific neural-network architecture called a Transformer.

### 1. Generative
It creates things — text, code, summaries, explanations, etc.


### 2. Pre-trained
Before you ever use it, the model is trained on massive amounts of text to learn:
- language patterns
- facts
- reasoning
- common writing styles

### 3. Transformer
It convert the particular input into a particular output

Example:
```
   hi -> Transformer -> hello
(input)               (output)
```
it can transform:
- text to img
- voice to text\
ect...

> to understand you can take example of google translator it is a transformer that transform the word from one language to another

in case of LLM transform predict the next word append it to original input until we get our final desired output

example:
```
"hey, i am Am" -> transformer -> "a"
```
```
"hey, i am Ama" -> transformer -> "n"
```
```
"hey, i am Aman" -> transformer -> end
```
therefor from above example we can see that our transformer works as follows:
```
"hey, i am Am" -> transformer -> "hey, i am Aman"
   (input)                          (output)
```
> in actual LLM it is used to predict and complete the response instead of autocompletion

[Go To Top](#content)

---

# Tokenization and Encoding

### Tokenization
Tokenization is the process of breaking text into small units called tokens so the model can understand it.

Tokens can be:
- whole words → “cat”
- pieces of words → “play”, “ing”
- even characters → “a”, “b”

LLMs don’t read text letter-by-letter like humans.
They convert text into tokens first.

**Example:**

The sentence:\
“Playing football is fun.”

Might become tokens like:
- “Play”
- “ing”
- “ football”
- “ is”
- “ fun”
- “.”
> These tokens are just chopped-up pieces that the model knows how to handle.

### Encoding
After text is broken into tokens, the model still cannot understand them until they are turned into numbers.

Encoding = converting tokens into numbers.

Each token gets an ID.

**For example:**
- “Play” → 5021
- “ing” → 198
- “ football” → 13488
- “ is” → 318
- “ fun” → 1275
- “.” → 13
> These numbers go into the model for processing.

token and ending changes as per model to model

[visit this website to check how token are made and encoding is done as per different models](https://tiktokenizer.vercel.app/)

#### Vocabulary
In an LLM, the vocabulary is the complete list of all tokens the model knows.

Every token in this dictionary has:
- a token string (like “play”, “##ing”, “hello”)
- a token ID (a number)

The model can only understand and generate text using the tokens in this vocabulary.

High vocabulary size -> we have huge list of tokens -> cover large number of different words -> therefor we need less numbers of tokens fo encoding

example:
- "hey" -> token 1
- "there" -> token 


small vocabulary size -> we have small list of tokens -> cover less number of different words -> therefor we need high numbers of tokens for encoding

example:
- "h" -> token 1
- "e" -> token 2
- "y" -> token 3

> each llm model has their own vocabulary and the size of vocabulary changes from model to model



[Go To Top](#content)

---
# How to retrieve tokens using JS
1. install the dependencies
```bash
npm install @dqbd/tiktoken
```
2. Import `encoding_for_model` 
```js
import { encoding_for_model } from "@dqbd/tiktoken";
```
3. create `encoding_for_model` object
```js
const enc = encoding_for_model("gpt-4o");   // pass the LLM model whose token you want to compute
```
4. use `enc.encode()` to encode the text and `enc.decode()` to decode the tokens
```js
const text = "Hello! This is a tiktoken-lite example.";

const tokens = enc.encode(text);    // → text of tokens

const decoded = enc.decode(tokens); // token to text
```

### Full code
```js
import { encoding_for_model } from "@dqbd/tiktoken";

const enc = encoding_for_model("gpt-4o");   // or "gpt-4", "gpt-3.5-turbo", etc.

const text = "Hello! This is a tiktoken-lite example.";

const tokens = enc.encode(text);
console.log(tokens);             // → array of token IDs

console.log(tokens.length);      // → number of tokens

const decoded = enc.decode(tokens);
console.log(decoded);            // → original text

enc.free(); // clean up
```
Output:
```
Uint32Array(11) [
  13225,    0,   1328,
    382,  261,    260,
   8251, 2488, 188964,
   4994,   13
]
11
Uint8Array(39) [
   72, 101, 108, 108, 111,  33,  32,  84,
  104, 105, 115,  32, 105, 115,  32,  97,
   32, 116, 105, 107, 116, 111, 107, 101,
  110,  45, 108, 105, 116, 101,  32, 101,
  120,  97, 109, 112, 108, 101,  46
]
```

> in case of `enc.decode()` You're actually getting the original text, but you're seeing it in raw bytes (Uint8Array) because tiktoken-lite returns binary data, not a JS string.


### How to convert raw bytes (Unit8Array) to human readable text
to convert raw bytes into human-readable string we use `TextDecoder`
> TextDecoder is a built-in Web API (also available in Node.js) that converts raw bytes into a human-readable string.
1. create the `enc.decode()` object 
```js
const decoded = enc.decode(tokens); // this is a Uint8Array (bytes)
```
2. Decode the Uint8Array into a string
```js
const decodedText = new TextDecoder("utf-8").decode(decoded);
```
> UTF-8 is the most common encoding format today.
### Updated code
```js
import { encoding_for_model } from "@dqbd/tiktoken";

const enc = encoding_for_model("gpt-4o");

const text = "Hello! This is a tiktoken-lite example.";

const tokens = enc.encode(text);
console.log(tokens);             // token IDs

console.log(tokens.length);      // number of tokens

const decoded = enc.decode(tokens); // this is a Uint8Array (bytes)

const decodedText = new TextDecoder("utf-8").decode(decoded);
console.log(decodedText);        // → original text

enc.free();
```
Output:
```
Uint32Array(11) [
  13225,    0,   1328,
    382,  261,    260,
   8251, 2488, 188964,
   4994,   13
]
11
Hello! This is a tiktoken-lite example.
```

### Better know!
- A WebAssembly module (WASM) is a low-level, super-fast, binary format that runs in web browsers and Node.js.
- It gives you much better performance than plain JS for heavy tasks like tokenization, image processing, crypto, etc.
- JavaScript is great for dynamic logic, but not ideal for CPU-intensive operations.
- Browsers + Node needed a way to run fast, compiled code, 
so WebAssembly was created.

tiktoken runs the tokenizer inside a WebAssembly module, and every time you call:
```js
const enc = encoding_for_model("gpt-4o");
```
…it allocates memory for:
- vocabulary tables
- merge rules
- internal buffers

When you're done with that tokenizer instance, calling:
```js
enc.free();
``` 
tells the WASM runtime: \
“I’m finished with this tokenizer — you can safely delete its memory.”


[Go To Top](#content)

---

# Vector Embeddings

Vector embeddings are a way to turn things (words, images, sentences, users, products, code snippets, etc.) into lists of numbers so that a computer can understand and compare them mathematically.

### Simple idea

Think of an embedding as a coordinate for an object in a very high-dimensional space.
- Similar things → points close together
- Different things → points far apart

### Illustration (intuitive picture)
Imagine a big 3D space (real embeddings have hundreds of dimensions, but 3D is easier to visualize).

Suppose we embed some words:
| Word    | Vector (illustrative) |
| ------- | --------------------- |
| “king”  | (0.9, 0.7, 0.6)       |
| “queen” | (0.9, 0.8, 0.6)       |
| “apple” | (0.1, 0.2, 0.9)       |

Even without knowing numbers, notice:
- king and queen are close → their meanings are similar
- apple is far from them → meaning is unrelated

This is why embeddings help computers “understand” relationships.

### Why do we use embeddings?
Because computers can work with numbers easily.

Once something is represented as a vector, we can compute:
- similarity (cosine similarity, dot product)
- clustering
- nearest-neighbor search
- classification

> Embeddings turn things into numbers so computers can measure how similar they are.

### How it work with token encoding?

we do encode tokens, but in a different way than vector embeddings are used later.
#### Token Encoding (turn text → token IDs)
This is the first step.

Token encoding converts text into token IDs, which are just numbers from a vocabulary.

Example:\
“cat” → token 5321\
“cute” → token 1287

These numbers do NOT represent meaning.\
They are just IDs — like roll numbers in school.

#### Embedding Encoding (turn token ID → vector of meaning)
This is the second step.

The model takes those token IDs and converts each one into a vector embedding.

Example:\
Token ID 5321 → [0.27, 0.88, -0.12, ...]\
Token ID 1287 → [0.45, 0.93, 0.01, ...]

These do represent meaning.

#### So what’s the relationship?

Think of it like this:

**Text → Token IDs → Vector Embeddings**
1. You break text into tokens
2. Tokens become numeric IDs
3. Those IDs are used to look up meaningful vectors

[Go To Top](#content)

---
# Positional encoding
Positional encoding is how a Transformer model knows the order of words, because it cannot read text left-to-right by itself.

If you give the model these tokens:
- “dog bit man”
- “man bit dog”

> both contains same words i.e, "dog", "man" and "bit" therefor their token will be somewhat similar

The same tokens appear…\
but order changes the meaning completely.

Transformers don’t know order unless we add it.

Therefor in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of a token in a sequence

### Super simple illustration
Sentence:\
“cats are cute”

Tokens (just for example):
- cats → ID 5321
- are → ID 1123
- cute → ID 9981

Embeddings (just random example numbers):
- cats → `[0.12, 0.88]`
- are → `[0.02, 0.10]`
- cute → `[0.55, 0.95]`

Now add positional encodings like (just for example):
- position 1 → `[0.01, 0.05]`
- position 2 → `[0.10, 0.20]`
- position 3 → `[0.30, 0.40]`

After adding:
- “cats” becomes: `[0.12+0.01, 0.88+0.05]`
- “are” becomes: `[0.02+0.10, 0.10+0.20]`
- “cute” becomes: `[0.55+0.30, 0.95+0.40]`

Now the model knows:
- cats = word 1
- are = word 2
- cute = word 3

[Go To Top](#content)

---

# Self Attention
self attention is a mechanism that helps model to focus on most important words in a sentence based on a context

in self attention model vectors can talk with each other, and can also change their vector embedding to change their overall meaning

### example:

sentence:\
"the river bank"
> in above sentence the word "bank" refers to the land alongside the river

> please note that here bank is not your typical financial bank, therefor if you encode it normally our model will treat as normal financial bank

Tokens (just for example):
- "the" → ID 5321
- "river" → ID 1123
- "bank" → ID 9981

after encoding:
- "the" becomes: `[0.12+0.01, 0.88+0.05]`
- "river" becomes: `[0.02+0.10, 0.10+0.20]`
- "bank" becomes: `[0.55+0.30, 0.95+0.40]`
> here the embedding of bank represent the typical financial bank 

self attention:\
here the the "bank" vector will interact with "river" vector to capture its semantic meaning ("land alongside the river" not the "financial banks") 
- "the" becomes: `[0.12+0.01, 0.88+0.05]`
- "river" becomes: `[0.02+0.10, 0.10+0.20]`
- "bank" becomes: `[0.31+0.30, 0.83+0.40]`

### Main function of self attention mechanism is to:
- maintain the context / semantic meaning of th word
- relate words / tokens to each other



### single head self attention:
- It produces one attention pattern for the whole sentence.
- its like looking at the sentence with one type of reasoning.
- Example lenses: “who relates to who”

### Multi head self attention:
- Instead of one head, we use multiple heads. Each head focuses on different types of relationships.
- its like having 4 different experts read the sentence:
    - One checks grammar
    - One checks meaning
    - One checks position
    - One checks context
- All their outputs are combined to produce a richer understanding.

### Why Multi-Head Attention is Better
Because language is complex.

A word can relate to others in multiple ways:
- grammar
- meaning
- position
- sentiment
- action

One head can’t capture all that.

Multiple heads = multiple viewpoints = deeper understanding.

[Go To Top](#content)

---
# How to inspect this vector representation of word
Here’s a clear JavaScript example showing how to generate and inspect vector embeddings for an input text using the OpenAI Embeddings API.

### Using the OpenAI (oai) SDK — Node.js Example
```js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getEmbedding(text) {
  const response = await client.embeddings.create({
    model: "text-embedding-3-large",   // or "text-embedding-3-small"
    input: text
  });

  const embedding = response.data[0].embedding;
  console.log("Embedding length:", embedding.length);
  console.log("Embedding (first 10 numbers):", embedding.slice(0, 10));

  return embedding;
}

getEmbedding("Hello, vector embeddings!"); 
```
### What this code does
- Sends your text to the embedding model
- Receives back a vector array (hundreds or thousands of numbers)
- Logs:
    - The vector size
    - The first few numbers so you can inspect it

Example output
```
Embedding length: 3072
Embedding (first 10 numbers): [
  0.0123, -0.0192, 0.0015, ...
]
```
This vector is produced after the model has already applied:
- tokenization
- token embeddings
- positional encodings
- multiple transformer layers
- multi-head self-attention

But all of those steps happen inside the model, and you only get the final result.

[Go To Top](#content)

---

# How LLM generate Response
```
hi, how are you? → Encoder → output ┐
   (input)                          ├→ Decoder → Response
                              <SOS> ┘  
```

Encoder:
- here plain text is converted into tokens 
- vector and position embedding happen
- multi head self attention is done
- after all of the above process is done we get our final output

`<SOS>`:
- Start of String
- it represent the start of our response string
- as our model hasn't predict anything we have empty string here
> this tag changes model to model

Decoder:
- decodes the model understandable tokens into human understandable form

### How Response is Constructed
LLM predict response word by word

let say for input: `"hi, how are you?"`\
our model has predicted: `"<SOS>i am fi"`

```
hi, how are you? → Encoder → output ┐
   (input)                          ├→ Decoder → n
                       <SOS>i am fi ┘  
```
the next word it predict is `'n'`

we append that `'n'` into our response string and predict the next word
```
hi, how are you? → Encoder → output ┐
   (input)                          ├→ Decoder → e
                      <SOS>i am fin ┘  
```
we continue to predict the next word until we get `<EOF>` i.e, End Of Word
```
hi, how are you? → Encoder → output ┐
   (input)                          ├→ Decoder → <EOF>
                     <SOS>i am fine ┘  
```
This is iterative approach and we predict the next word during each iteration until we reach `<EOF>`
>we encode the input only once and reuse it for each iteration 

### How prediction works?
1. compute probability:
    - for given input our model compute the probability of what next word could be
    - example:\
    for `"<SOS>i am fi"`\
    we compute probability of next words as:
        - f = 0.9
        - g = 0.5
        - h = 0.2\
        etc...
2. softmax:
    - it is refer to a function that is responsible for picking the word as per the probability
    - it is not necessary that it will always pick the word with high probability
    - softmax function usually accepts a numerical attribute which define how randomly it will pick the words
    - example: \
    for softmax = 1: it will always pick the word with high probability\
    for softmax = 2: sometimes it will pick different word from the higher probability one   
    - softmax decides how creative our response cloud be



[Go To Top](#content)

---
# Context Window
A context window is the amount of text (tokens) an AI model can “see” at one time while answering.

### Example:
Suppose a model has a 100-token context window.

That means it can read only 100 tokens worth of text at a time.

If you give it 300 tokens:
- It can only “remember” the latest 100
- The earlier 200 fall out of the window

Like a sliding window:
```
[ Old text falls out ]  [ Model can see this part ]
```

### How is Context Window Size Determined?
The context window size is not chosen at runtime — it is fixed by the model’s architecture and training setup.

It mainly depends on three things:
1. Position Embedding Length:\
If the model is trained with 10,000 positional embeddings, then:
    - Max context = 10,000 tokens
    - Model cannot read more than that
2. Model Training Window:\
If a transformer is trained with sequences of 4096 tokens, the context window becomes 4096.
3. Memory & Compute Limits\
Self-attention has O(n²) cost:
    ```
    tokens = n
    operations ≈ n²
    ```
    So:
    - 4k tokens → ~16M attention operations
    - 100k tokens → 10 billion operations
    - 1M tokens → 1 trillion operations (too expensive)

    This limits how large the window can be.

> New techniques (like linear attention, flash attention, ring attention) help push it to 100k–1M+ tokens.

### Stateless Architecture
if your previous chat messages are still inside the context window, they are passed to the model again on every request.

Therefor we can say that:\
LLMs do not remember anything between requests.
All “memory” must be resent each time.


### Summary
Context window size is determined by:

1. How many positional embeddings the model has
2. How long the sequences were during training
3. How much memory the architecture can handle

This is why different models have different limits:
- earlier GPT → 4k
- Llama → 8k–32k
- GPT-4 → 128k
- new models → 1M+ tokens

[Go To Top](#content)

---
# Token Cost and Token Limits
token cost and token limits, are useful when working with embeddings, chat models, or any LLM API.

### What is a Token?
A token is a unit of text used by the model.

It can be:
- a full word → `"fantastic"`
- part of a word → `"embed"`, `"ding"`
- punctuation → `"!"`
- whitespace

For English text, 1 token ≈ 3–4 characters, or 1 token ≈ 0.75 words.

#### Example:
```
"Hello world!" → 3 tokens ("Hello", "world", "!")
```

### What is Token Cost?
This is the money charged based on the number of tokens the model processes.

There are two types:
#### 1.  Input tokens (what you send)
You are charged for:
- your prompt
- system instructions
- messages
- input text for embeddings

#### 2. Output tokens (what the model generates)
You’re also charged for:
- the model’s response

> Different models have different pricing for input vs output tokens.

if your previous chat messages are still inside the context window, they are passed to the model again on every request.

Therefor you pay again for the tokens of old messages If they are included in context window.

#### Example:
your context window size = 6000 tokens
- pervious conversation = 5000 tokens
- You send a new message of 10 tokens
- You will pay for 5010 input tokens again, as context window is not yet filled.

> therefor we can say that if your conversation goes on too long your overall cost for each request will be equal to token cost of context window same for each response
>
> reason: your context window will always be full

#### How to avoid paying the full context-window cost on every request
You prevent the context window from staying full by doing things like:
1. **Summarizing older messages:**\
Replace long sections of conversation with short summaries.
2. **Truncating old messages**\
Cut off history that is no longer relevant.
3. **Using retrieval-based memory**\
Store facts externally and fetch only what’s relevant using vector search. You don’t resend the whole conversation.
4. **Keeping a smaller active history window**\
Only include the last X messages (e.g., last 10 exchanges).
5. **Stopping before reaching max context**\
If your conversation is still short, cost stays low.

6. **Using models that compress long contexts**\
Some models internally compress earlier tokens, reducing effective history size.


### What is a Token Limit?
Every model has a maximum number of tokens it can handle at one time.
This is called context length.

For example:
| Model                  | Max tokens (context window)  |
| ---------------------- | ---------------------------- |
| GPT-4.1                | ~128k context                |
| GPT-4.1-mini           | ~128k context                |
| text-embedding-3-large | ~3M tokens (for embeddings!) |

#### Important:
- Token limit includes both input and output.
- For embeddings models, token limits are much larger than chat models.


[Go To Top](#content)

---

