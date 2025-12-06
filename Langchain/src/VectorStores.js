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
