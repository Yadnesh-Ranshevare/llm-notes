import { RunnableParallel } from "@langchain/core/runnables";

const parallel = RunnableParallel.from({
  lower: (x) => x.toLowerCase(),
  upper: (x) => x.toUpperCase(),
});

const result = await parallel.invoke("LangChain");
console.log(result);