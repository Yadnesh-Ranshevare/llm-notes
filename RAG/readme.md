# Content
1. [Introduction](#introduction)
2. [hallucination](#hallucination)
3. [Why RAG Exists](#why-rag-exists)
4. [How Traditional RAG works](#how-traditional-rag-works)


----

# Introduction
- Retrieve Augmented Generator (RAG) is the process of optimizing the output of a LLM, so it references an authoritative knowledge based outside of its training data source before generating a response

- LLM are trained on a vast volume of data and use billions of parameters to generate original output for task like answering questions, translating language, and computing sentence.

- RAG extends the already powerful capabilities of LLM's to specific domain of an organization's internal knowledge base, all without the need to retrain the model

- it is a cost effective approach to improving LLM output so it remain relevant, accurate, and useful in various context

RAG is a technique in AI that combines retrieval of relevant information with generation of answers. 

it helps AI models give more accurate and up-to-date responses by looking up external data rather than relying solely on what they “remember” from training.

Here’s a simple way to visualize it:
1. **Query understanding:** You ask a question, like “What are the latest features of Python 3.12?”
2. **Retrieval:** The system searches a large database or documents to find relevant info.
3. **Generation:** The AI uses the retrieved data to generate a coherent, human-like answer.

> So instead of guessing from memory, it’s like the AI saying:\
>"Let me check my notes, then I’ll give you a detailed answer."

### Example
Question: “Who won the Nobel Prize in Physics in 2024?”

RAG system:
- Retrieves: News articles or databases mentioning the 2024 winner.
- Generates: A clear answer: “The 2024 Nobel Prize in Physics was awarded to … because of their work on …”

> This makes the AI more factual, especially for recent or specialized topics.

[Go To Top](#content)

---

# hallucination
AI hallucination is when an AI makes up answers that sound real but aren’t true. It’s like when someone confidently tells you a story, but they’re just guessing.

### Example:
- You ask: “Who invented the first flying car?”
- AI says: “It was invented by James Wilson in 2010.” → ❌ Wrong, it’s made up.

### Why it happens:
- AI predicts what words should come next, not what is actually true.
- If it doesn’t know the fact, it “fills in the blanks” with something that sounds believable.

### When it happen:
1. **The AI doesn’t have enough information**
    - If it hasn’t seen the fact before, it tries to guess.
    - Example: Asking about a very new technology or a recent event.

2. **The question is vague or ambiguous**
    - The AI fills in details to make the answer sound complete.
    - Example: “Tell me about the scientist who discovered something important.” → It might invent a name.

3. **Complex reasoning or unusual questions**
    - When the AI has to combine multiple pieces of info, it may make mistakes.
    - Example: “Who would win in a chess match between Einstein and Newton?”

4. **Creative or open-ended prompts**
    - If you ask for predictions, stories, or explanations, it may invent facts.
    - Example: “Explain the hidden secrets of Mars colonization in 2025.”
> In short: Hallucination happens when the AI tries to answer without verified knowledge or when the question is tricky or very new.

### Most common scenario when hallucination occur
- let say your model is trained until the data of 2024
- you ask the question related to event that occur in 2025 
- your model will hallucinate and will give some random answer

[Go To Top](#content)

---

# Why RAG Exists
The main reason why RAG exist is as follows
### 1. LLMs can’t store large private data inside themselves
- Large language models have a fixed capacity based on their parameters. They cannot “remember” every private document, company report, or research paper you have. Even if you fine-tune them, there’s a limit to how much data can be incorporated.
- If you ask the AI about some confidential or company-specific data, it won’t know it unless that info is included during training, which is often impractical.
- RAG allows the AI to retrieve data from external sources—like your internal documents, databases, or knowledge bases—at the time of the query. The AI doesn’t have to memorize everything; it just looks up what’s needed.
- **Example**: A company wants the AI to answer questions from its internal policy documents. Instead of training the AI on thousands of pages (expensive and limited), RAG retrieves relevant sections when a question is asked and uses them to generate the answer.

### 2. They hallucinate
- LLMs often produce information that sounds possible but is actually false. This happens because they predict text based on patterns, not verified facts.
- You can’t fully trust answers from a plain LLM, especially for technical, legal, or scientific queries.
- In RAG by retrieving real documents before generating a response, the AI can ground its answers in actual sources, drastically reducing hallucinations.
- **Example**: Without RAG, the AI might say “Dr. X invented a device in 2015” (made-up). With RAG, it first looks up the research papers and then correctly states the inventor and year.

### 3. They can’t access updated information
- LLMs are trained on data available up to a certain cutoff date. Anything new (like the latest technology, news, or scientific discoveries) is unknown to them.
- The AI gives outdated or wrong answers when asked about recent events or developments.
- RAG fetches the latest information from external sources in real time. The model doesn’t need to be retrained to know new facts.
- **Example**: Asking “Who won the Nobel Prize in 2025?” a regular LLM might guess or hallucinate. With RAG, it retrieves the latest announcement and gives the correct answer.

### 4. They are expensive to fine-tune
- Updating a large language model with new knowledge requires retraining or fine-tuning millions/billions of parameters, which is costly and time-consuming.
- Therefor you can’t constantly update the model with new internal or external information.
- Hence in RAG instead of retraining, you just update the documents the AI searches. The AI automatically has access to new knowledge without expensive fine-tuning.
- **Example**: A company releases new product manuals. Instead of retraining the model, RAG indexes the new manuals. Now, AI can answer questions about the new products immediately.

[Go To Top](#content)

---
# How Traditional RAG works

<img src="../images/RAG_architecture.png" style="width:800px">

### Data Integration Pipeline

A data integration pipeline is the part of a RAG system responsible for bringing raw documents from different sources into a clean, consistent, searchable format and string it into vector database for retrieval


The raw data can be in any format:
- PDFs
- Word documents
- Websites
- Databases
 CSVs
- Emails
- Logs

But These raw data can’t be used directly, Therefor we perform parsing and embedding

- Parsing: dividing raw data into smaller chunks
- embedding: converting those chunks into vectors
- now this vector can be stored inside the vector db



### Retrieval Pipeline
A data retrieval pipeline is the part of a RAG system responsible for finding the right information from a large collection of documents before the LLM answers your question.

It’s a step-by-step process that takes your query, searches through millions of documents, picks the most relevant ones, and gives them to the LLM so it can answer correctly.

Without this pipeline, the LLM would have nothing to retrieve, and it would rely only on guesswork or old training data.

- in this pipeline we also perform embedding to convert user query into vector
- this vector is used to to retrieve the relevant information form vector db
- this retrieved info is what we called context 
- now this context along with a prompt is given to LLM to generate the response

### Vector db:
A vector database is a special type of database designed to store and search vectors—numerical representations of text, images, audio, or any data that describes meaning or similarity.

In RAG systems, it's the place where all document embeddings are stored so the system can quickly find the most relevant information for a user’s query.

>This vector db is also known as Knowledge base

#### Why vectors?
When you convert text into an embedding (vector), you get something like:
```
[0.12, -0.55, 0.88, 1.02, ...]
```
These numbers capture semantic meaning, so similar texts end up with similar vectors.

by doing this it gets easy to retrieve the similar information from vector db as they are close to each other


[Go To Top](#content)

---