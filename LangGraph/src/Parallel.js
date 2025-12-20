import { StateGraph, START, END } from "@langchain/langgraph";
import { z } from "zod";

const GraphState = z.object({
    fours: z.number(),
    sixes: z.number(),
    totalRuns: z.number(),
    ballFaced: z.number(),
    boundaryPercentage: z.number(),
    strickRate: z.number(),
    ballsPerBoundary: z.number(),
    summary: z.string(),
});

const graph = new StateGraph(GraphState);

// function calculateStrickRate(state){
//     state.strickRate = (state.totalRuns/state.ballFaced)*100
//     return state
// }
function calculateStrickRate(state) {
    return {
        strickRate: (state.totalRuns / state.ballFaced) * 100,
    };
}

graph.addNode("calculate_Strick_Rate", calculateStrickRate);

// function calculateBoundaryPercentage(state){
//     const four = state.fours * 4    // runs scored by 4's
//     const six = state.sixes * 6     // run scored by 6's
//     state.boundaryPercentage = (state.ballFaced / (four + six)) * 100
//     return state
// }
function calculateBoundaryPercentage(state) {
    const fourRuns = state.fours * 4;
    const sixRuns = state.sixes * 6;

    return {
        boundaryPercentage: (state.ballFaced / (fourRuns + sixRuns)) * 100,
    };
}

graph.addNode("calculate_Boundary_Percentage", calculateBoundaryPercentage);

// function calculateBallsPerBoundary(state){
//     state.ballsPerBoundary = (state.ballFaced / (state.fours + state.sixes))
//     return state
// }
function calculateBallsPerBoundary(state) {
    return {
        ballsPerBoundary: state.ballFaced / (state.fours + state.sixes),
    };
}

graph.addNode("calculate_balls_per_boundary", calculateBallsPerBoundary);

function generateSummary(state) {
    state.summary = `strick Rate = ${state.strickRate} \nboundary percentage = ${state.boundaryPercentage} \n balls per boundary =  ${state.ballsPerBoundary}`;
    return state;
}

graph.addNode("generate_summary", generateSummary);

graph.addEdge(START, "calculate_Strick_Rate");
graph.addEdge(START, "calculate_Boundary_Percentage");
graph.addEdge(START, "calculate_balls_per_boundary");

graph.addEdge("calculate_Strick_Rate", "generate_summary");
graph.addEdge("calculate_Boundary_Percentage", "generate_summary");
graph.addEdge("calculate_balls_per_boundary", "generate_summary");

graph.addEdge("generate_summary", END);

const workflow = graph.compile();

const initialState = {
    fours: 4,
    sixes: 2,
    totalRuns: 80,
    ballFaced: 100,
};

const finalState = await workflow.invoke(initialState);
console.log(finalState);

/*
{
  fours: 4,
  sixes: 2,
  totalRuns: 80,
  ballFaced: 100,
  boundaryPercentage: 357.14285714285717,
  strickRate: 80,
  ballsPerBoundary: 16.666666666666668,
  summary: 'strick Rate = 80 \n' +
    'boundary percentage = 357.14285714285717 \n' +
    ' balls per boundary =  16.666666666666668'
}
*/
