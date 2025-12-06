import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"

const pdfPath = "./src/Documentloaders/docs/pdfLoder.pdf"

const loader = new PDFLoader(pdfPath)

const docs = await loader.load()
console.log({ docs })