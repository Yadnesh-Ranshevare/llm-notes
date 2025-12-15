import {
  RunnableLambda,
  RunnableWithFallbacks,
} from "@langchain/core/runnables";

const primary = new RunnableLambda({
  func: (x) => {
    throw new Error("Failed");
  },
});

const fallback = new RunnableLambda({
  func: (x) => "Fallback result",
});

const runnable = new RunnableWithFallbacks({
  runnable: primary,
  fallbacks: [fallback],
});

const result = await runnable.invoke("input");
console.log(result);
// Fallback result
