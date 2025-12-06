import { TokenTextSplitter } from "@langchain/textsplitters";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text"

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()


const splitter = new TokenTextSplitter({ encodingName: "cl100k_base", chunkSize: 10, chunkOverlap: 0 });

const texts = await splitter.splitText(docs[0].pageContent);
console.log(texts);