import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const markdownText = `
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn't split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
`;

const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    { chunkSize: 60, chunkOverlap: 0 }
);
const mdDocs = await mdSplitter.createDocuments([ markdownText ]);
// const mdDocs = await mdSplitter.splitDocuments([{
//   pageContent: markdownText,
//   metadata: { source: "langchain-notes.md" }
// }]);

console.log(mdDocs);