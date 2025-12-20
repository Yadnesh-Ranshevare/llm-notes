import { StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const GraphState = z.object({
    a: z.number(),
    b: z.number(),
    c: z.number(),

    equation: z.string(),
    discriminant: z.number(),
    result: z.string(),
});

const graph = new StateGraph(GraphState);

function ShowEquation(state) {
    const equation = state.a + "x^2 + " + state.b + "x + " + state.c + " = 0";
    return { equation: equation };
}

graph.addNode("show_equation", ShowEquation);

function calculateDiscriminant(state) {
    const discriminant = state.b * state.b - 4 * state.a * state.c;
    return { discriminant: discriminant };
}

graph.addNode("calculate_discriminant", calculateDiscriminant);

function calculateRealRoots(state) {
    const root1 = (-state.b + Math.sqrt(state.discriminant)) / (2 * state.a);
    const root2 = (-state.b - Math.sqrt(state.discriminant)) / (2 * state.a);
    return { result: `Root1 = ${root1} \nRoot2 = ${root2}` };
}

graph.addNode("calculate_real_roots", calculateRealRoots);

function calculateRepeatedRoot(state) {
    const root = -state.b / (2 * state.a);
    return { result: `Root = ${root}` };
}

graph.addNode("calculate_repeated_root", calculateRepeatedRoot);

function calculateImaginaryRoots(state) {
    return { result: "no real roots" };
}

graph.addNode("calculate_imaginary_roots", calculateImaginaryRoots);

function condition(state) {
    if (state.discriminant > 0) {
        return "calculate_real_roots";
    } else if (state.discriminant == 0) {
        return "calculate_repeated_root";
    } else {
        return "calculate_imaginary_roots";
    }
}

graph.addEdge(START, "show_equation");
graph.addEdge("show_equation", "calculate_discriminant");
graph.addConditionalEdges("calculate_discriminant", condition);
graph.addEdge("calculate_real_roots", END);
graph.addEdge("calculate_repeated_root", END);
graph.addEdge("calculate_imaginary_roots", END);

const workflow = graph.compile();

const initialState = {
    a: 4,
    b: 10,
    c: 6,
};

const finalState = await workflow.invoke(initialState);
console.log(finalState);

/*
{
  a: 4,
  b: 10,
  c: 6,
  equation: '4x^2 + 10x + 6 = 0',
  discriminant: 4,
  result: 'Root1 = -1 \nRoot2 = -1.5'
}
*/
