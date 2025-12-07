import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

async function retrievalPipeline(Query, k) {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.API_KEY,
    });

    // vector store logic here
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

    const results = await vectorStore.similaritySearch(Query, k);
    console.log("Similarity Search Results:", results);
}

const query = "when google was founded?";

retrievalPipeline(query, 3);
