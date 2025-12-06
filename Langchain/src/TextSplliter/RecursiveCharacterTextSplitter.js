import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 0 })
const texts = await splitter.splitText(docs[0].pageContent)

console.log({ texts })