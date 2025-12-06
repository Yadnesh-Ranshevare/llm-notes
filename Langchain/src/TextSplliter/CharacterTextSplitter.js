import { TextLoader } from "@langchain/classic/document_loaders/fs/text"
import { CharacterTextSplitter } from "@langchain/textsplitters";

const Path = "./src/Documentloaders/docs/txtLoder.txt"

const loader = new TextLoader(Path)
const docs = await loader.load()

const splitter = new CharacterTextSplitter({
    separator: "\n\n",
    chunkSize: 1000,
    chunkOverlap: 200,
});
const texts = await splitter.splitText(docs[0].pageContent)

console.log({ texts })