import { RunnableLambda } from "@langchain/core/runnables";

const addPrefix = (text) => `Topic: ${text}`;

const addPrefixRunnable = new RunnableLambda({
  func: addPrefix,
});

const result = await addPrefixRunnable.invoke("LangChain");

console.log(result); // Output: Topic: LangChain