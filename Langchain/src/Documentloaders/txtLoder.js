import { TextLoader } from "@langchain/classic/document_loaders/fs/text"


const Path = "./src/Documentloaders/docs/txtLoder.txt"


const loader = new TextLoader(Path)

const docs = await loader.load()
console.log({ docs })