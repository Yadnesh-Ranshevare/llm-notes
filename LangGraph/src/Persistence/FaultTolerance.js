import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";

const schema = z.object({
    nodeA: z.boolean().default(false),
    nodeB: z.boolean().default(false),
    nodeC: z.boolean().default(false),
});

const checkpointer = new MemorySaver();

const graph = new StateGraph(schema);

function NodeA(state) {
    console.log("node A done");
    return { nodeA: true };
}
let attempt = 0;
async function NodeB(state) {
    if (attempt < 2) {
        attempt++;
        throw new Error("NodeB failed");
    }
    console.log("node B done");
    return { nodeB: true };
}

function NodeC(state) {
    console.log("node C done");
    return { nodeC: true };
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);
graph.addNode("NodeC", NodeC);

graph.addEdge(START, "NodeA");
graph.addEdge("NodeA", "NodeB");
graph.addEdge("NodeB", "NodeC");
graph.addEdge("NodeC", END);

const workflow = graph.compile({ checkpointer });

const initialState = {
    nodeA: false,
    nodeB: false,
    nodeC: false,
};

const config = {
    configurable: {
        thread_id: "1",
    },
};

try {
    await workflow.invoke(initialState, config);
} catch (error) {
    console.error(error.message);
}
try {
    await workflow.invoke(undefined, config);
} catch (error) {
    console.error(error.message);
}
await workflow.invoke(undefined, config);

/*
node A done
NodeB failed
NodeB failed
node B done
node C done
*/