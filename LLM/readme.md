# Content
1. [What is LLM](#what-is-llm)
2. [Generative Pre-Trained Transformer (GPT)](#generative-pre-trained-transformer-gpt)
3. [Tokenization and Encoding](#tokenization-and-encoding)
4. [Vector Embeddings](#vector-embeddings)
5. [Positional encoding](#positional-encoding)
6. [Self Attention](#self-attention)
7. [How LLM generate Response](#how-llm-generate-response)
8. [Context Window](#context-window)


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
- "there" -> token 2


small vocabulary size -> we have small list of tokens -> cover less number of different words -> therefor we need high numbers of tokens for encoding

example:
- "h" -> token 1
- "e" -> token 2
- "y" -> token 3

> each llm model has their own vocabulary and the size of vocabulary changes from model to model


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

