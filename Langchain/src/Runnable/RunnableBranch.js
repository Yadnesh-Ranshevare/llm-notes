import { RunnableBranch } from "@langchain/core/runnables";

const branch = RunnableBranch.from([
    [(x) => x.length < 5, (x) => "SHORT"],
    [(x) => x.length >= 5, (x) => "LONG"],
    (x) => "UNKNOWN",
]);

const result = await branch.invoke("Hello");
console.log(result);