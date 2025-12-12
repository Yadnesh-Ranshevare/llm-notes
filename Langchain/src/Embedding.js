import "dotenv/config";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});



const pdfPath = "src/Documentloaders/docs/pdfLoder.pdf";
const loader = new PDFLoader(pdfPath);
const docs = await loader.load();

const pdfVectors = await embeddings.embedDocuments([docs[0].pageContent]);
console.log("document embedding:", pdfVectors);



const documents = [
    "LangChain is a framework for developing applications powered by language models.",
    "It enables developers to build robust and scalable LLM applications with ease.",
    "LangChain uses a combination of Python and OpenAI's API to power its features, making it a versatile tool for building LLM applications."
]

const docVectors = await embeddings.embedDocuments(documents);
console.log("document embedding:", docVectors);




const query = "What is LangChain?";
const queryVector = await embeddings.embedQuery(query);
console.log("Query embedding", queryVector);
