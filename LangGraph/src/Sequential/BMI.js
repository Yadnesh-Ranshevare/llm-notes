import { z } from "zod";
import { StateGraph, START, END } from "@langchain/langgraph";

const GraphState = z.object({
    height: z.number(),
    weight: z.number(),
    bmi: z.number(),
});

const graph = new StateGraph(GraphState);

function BMI(state) {
    const height = state.height;
    const weight = state.weight;
    const bmi = weight / (height * height);

    const newState = {
        height,
        weight,
        bmi,
    };
    return newState;
}

graph.addNode("calculate_bmi", BMI);

graph.addEdge(START, "calculate_bmi");

graph.addEdge("calculate_bmi", END);

const workflow = graph.compile();

const initialState = {
    height: 1.8,
    weight: 80,
};

const res = await workflow.invoke(initialState);

console.log(res);   // { height: 1.8, weight: 80, bmi: 24.691358024691358 }
