import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { z } from "zod";

// const schema = z.object({
//     count: z.array(z.string()),
// });
const schema = Annotation.Root({
    count: Annotation({
        schema: z.array(z.string()),
        default: () => [],
        reducer: (prev, next) => prev.concat(next),
    }),
})

const graph = new StateGraph(schema);

function NodeA(state) {
    return {count:["NodeA"]};
}

function NodeB(state) {
    return {count:["NodeB"]};
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);

graph.addEdge(START, "NodeA");
graph.addEdge(START, "NodeB");
graph.addEdge("NodeB", END);
graph.addEdge("NodeA", END);

const workflow = graph.compile();

const initialState = {
    count: ["start"],
};

const res = await workflow.invoke(initialState);
console.log(res);
