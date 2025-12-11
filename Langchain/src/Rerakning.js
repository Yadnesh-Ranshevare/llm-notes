import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { BM25Retriever } from "@langchain/community/retrievers/bm25";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { EnsembleRetriever } from "@langchain/classic/retrievers/ensemble";
import { CohereRerank } from "@langchain/cohere";

// from line no. 10 to 123 is hybrid search code
// to checkout reranking only, skip to line no. 126

// some sample text chunks
const chunks = [
    // Tesla - Financial & Production
    "Tesla reported record quarterly revenue of $25.2 billion in Q3 2024.",
    "Tesla's automotive gross margin improved to 19.3% this quarter.",
    "Tesla Cybertruck production ramp begins in 2024 with initial deliveries.",
    "Tesla announced plans to expand Gigafactory production capacity.",
    "Tesla stock price reached new highs following earnings announcement.",
    "Tesla's energy storage business grew 40% year-over-year.",
    "Tesla continues to lead in electric vehicle market share globally.",
    "Tesla Model Y became the best-selling vehicle worldwide.",
    "Tesla reported strong free cash flow generation of $7.5 billion.",
    "Tesla's Full Self-Driving revenue increased significantly.",

    // Microsoft - Development & Acquisitions
    "Microsoft acquired GitHub for $7.5 billion in 2018.",
    "Microsoft's cloud revenue Azure grew 29% year-over-year.",
    "Microsoft announced new AI features for Visual Studio Code.",
    "Microsoft Teams integration with GitHub enhances developer workflow.",
    "Microsoft's developer tools division sees strong adoption.",
    "Microsoft acquired Activision Blizzard for $68.7 billion.",
    "Microsoft's productivity suite gained 50 million new users.",
    "Microsoft announced new Surface devices for developers.",
    "Microsoft's AI Copilot features expand to more development tools.",
    "Microsoft's enterprise solutions drive revenue growth.",

    // NVIDIA - AI & Hardware
    "NVIDIA's data center revenue reached $47.5 billion annually.",
    "NVIDIA's H100 GPUs see unprecedented demand for AI training.",
    "NVIDIA announced next-generation Blackwell architecture.",
    "NVIDIA's gaming revenue declined due to crypto market changes.",
    "NVIDIA's automotive AI platform partnerships expanded.",
    "NVIDIA's AI chip shortage affects cloud providers.",
    "NVIDIA stock valuation exceeds $2 trillion market cap.",
    "NVIDIA's CUDA platform dominates AI development.",
    "NVIDIA announced new AI inference chips for edge computing.",
    "NVIDIA's partnership with major cloud providers strengthens.",

    // Google/Alphabet - AI & Cloud
    "Google's AI investments total over $100 billion in recent years.",
    "Google Cloud revenue grew 35% reaching $8.4 billion quarterly.",
    "Google announced Gemini AI model competing with GPT-4.",
    "Google's search advertising revenue remains strong at $59 billion.",
    "Google's Workspace products integrate advanced AI features.",
    "Google announced quantum computing breakthroughs.",
    "Google's autonomous vehicle division Waymo expands operations.",
    "Google's AI research published breakthrough papers.",
    "Google's cloud AI services see enterprise adoption.",
    "Google faces regulatory scrutiny over AI dominance.",

    // Noisy/Less Relevant Chunks
    "The Tesla coil was invented by Nikola Tesla in 1891.",
    "Microsoft Excel spreadsheet formulas can be complex for beginners.",
    "NVIDIA Shield TV streaming device gets software update.",
    "Google Maps navigation improved with real-time traffic data.",
    "Production delays affected multiple manufacturing sectors.",
    "Financial markets showed volatility during earnings season.",
    "Revenue recognition standards changed for software companies.",
    "Hardware components face supply chain constraints globally.",
    "Development tools market grows with remote work trends.",
    "AI research requires significant computational resources.",
    "Quarterly reports show mixed results across tech sector.",
    "Stock market analysts upgrade technology sector ratings.",
    "Cloud computing adoption accelerates in enterprise market.",
    "Data center construction increases globally.",
    "Semiconductor shortage impacts various industries.",
    "Electric vehicle charging infrastructure expands rapidly.",
    "Software development productivity tools gain popularity.",
    "Machine learning frameworks become more accessible.",
    "Enterprise software licensing models evolve.",
    "Technology conferences showcase latest innovations.",
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

const bm25retriever = BM25Retriever.fromDocuments(documents, { k: 3 });

const hybridRetriever = new EnsembleRetriever({
    retrievers: [vectorRetriever, bm25retriever],
    weights: [0.7, 0.3], // 70% vector, 30% BM25/keyword
});

const test_query = "purchase cost 7.5 billion";

const retrieved_chunks = await hybridRetriever.invoke(test_query);

console.log("Retrieved Chunks:");
console.log(retrieved_chunks);
// hybrid search code ends here

// from here starts reranking code
const reranker = new CohereRerank({
    model: "rerank-english-v3.0",
    topN: 10,
    apiKey: process.env.COHERE_KEY,
});

const rerankedDocs = await reranker.compressDocuments(retrieved_chunks, test_query);

console.log("Reranked Results:");
console.log(rerankedDocs);


// output:
/*
Retrieved Chunks:
[
  Document {
    pageContent: 'Tesla reported strong free cash flow generation of $7.5 billion.',
    metadata: { id: '9' },
    id: '9'
  },
  Document {
    pageContent: "NVIDIA's data center revenue reached $47.5 billion annually.",
    metadata: { id: '21' },
    id: '21'
  },
  Document {
    pageContent: 'Microsoft acquired Activision Blizzard for $68.7 billion.',
    metadata: { id: '16' },
    id: '16'
  },
  {
    pageContent: 'Microsoft acquired GitHub for $7.5 billion in 2018.',
    metadata: { id: '11' }
  }
]
Reranked Results:
[
  {
    pageContent: 'Microsoft acquired GitHub for $7.5 billion in 2018.',
    metadata: { id: '11', relevanceScore: 0.9530133 }
  },
  Document {
    pageContent: 'Tesla reported strong free cash flow generation of $7.5 billion.',
    metadata: { id: '9', relevanceScore: 0.0849471 },
    id: '9'
  },
  Document {
    pageContent: 'Microsoft acquired Activision Blizzard for $68.7 billion.',
    metadata: { id: '16', relevanceScore: 0.03803509 },
    id: '16'
  },
  Document {
    pageContent: "NVIDIA's data center revenue reached $47.5 billion annually.",
    metadata: { id: '21', relevanceScore: 0.00003194182 },
    id: '21'
  }
]
*/