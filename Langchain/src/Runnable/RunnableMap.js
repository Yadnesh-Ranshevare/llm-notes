import { RunnableMap } from "@langchain/core/runnables";

const map = RunnableMap.from({
  original: (x) => x + " Langchain",
  length: (x) => x.length,
});

const result = await map.invoke("AI");
console.log(result); // Output: { original: 'AI Langchain', length: 2 }