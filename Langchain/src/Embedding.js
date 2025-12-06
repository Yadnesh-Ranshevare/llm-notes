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

const docVectors = await embeddings.embedDocuments([docs[0].pageContent]);
console.log("First document embedding:", docVectors);




const query = "What is LangChain?";
const queryVector = await embeddings.embedQuery(query);
console.log("Query embedding", queryVector);
