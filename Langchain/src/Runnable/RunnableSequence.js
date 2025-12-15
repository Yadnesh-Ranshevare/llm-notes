import { RunnableSequence } from "@langchain/core/runnables";

const chain = RunnableSequence.from([
  (x) => `Topic: ${x}`,
  (x) => x.toUpperCase(),
]);

const result = await chain.invoke("runnables");
// TOPIC: RUNNABLES

console.log(result);