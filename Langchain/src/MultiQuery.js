import "dotenv/config";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { z } from "zod";

const QueryVariationsSchema = z.object({
    queries: z.array(z.string()),
});

const original_query = "What are the two main components of the Transformer architecture? ";

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const llmWithTool = llm.withStructuredOutput(QueryVariationsSchema);

const prompt = `Generate 3 different variations of this query that would help retrieve relevant documents:

Original query: ${original_query}

Return 3 alternative queries that rephrase or approach the same question from different angles.`;

const res = await llmWithTool.invoke(prompt);
console.log(res);

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

const allResults = [];

for (const query of res.queries) {
    const similaritySearchResults = await vectorStore.similaritySearch(query, 3);
    allResults.push(similaritySearchResults);
}
console.log("All Similarity Search Results:", allResults);
