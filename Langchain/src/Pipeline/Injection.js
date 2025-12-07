import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import "dotenv/config";

async function loadDocument(path) {
    const loader = new DirectoryLoader(path, {
        ".txt": (path) => new TextLoader(path),
    });
    const documents = await loader.load();
    return documents;
}

async function splitDocument(documents, chunkSize = 1000, chunkOverlap = 0) {
    // splitting logic here
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: chunkSize, chunkOverlap: chunkOverlap });

    const splitDocs = await splitter.splitDocuments(documents);
    return splitDocs;
}

async function VectorStore() {
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

    return vectorStore;
}

async function InjectionPipeline() {
    // load the document
    const documents = await loadDocument("src/pipeline/docs");
    // console.log(documents);

    // split the document
    const splitDocs = await splitDocument(documents);
    // console.log(Array.from({ length: splitDocs.length }, (_, i) => String(i + 1)));

    // create vector store
    const vectorStore = await VectorStore();
    // console.log("Vector Store created:", vectorStore);

    // add split documents to vector store
    await vectorStore.addDocuments(splitDocs,{ids: Array.from({ length: splitDocs.length }, (_, i) => String(i + 1))});
}

InjectionPipeline();
