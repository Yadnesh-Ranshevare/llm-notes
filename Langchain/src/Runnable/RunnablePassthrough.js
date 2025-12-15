import { RunnablePassthrough } from "@langchain/core/runnables";

const chain = RunnablePassthrough.assign({
  length: (x) => x.input.length,
});

const result = await chain.invoke({input:"LangChain"});
console.log(result); // Output: { input: 'LangChain', length: 9 }