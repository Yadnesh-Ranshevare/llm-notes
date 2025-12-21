import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { z } from "zod";

const schema = z.object({
    Steps: z.array(z.string()),
});

const checkpointer = new MemorySaver();

const graph = new StateGraph(schema);

function NodeA(state) {
    state.Steps.push("NodeA");
    return state;
}

function NodeB(state) {
    state.Steps.push("NodeB");
    return state;
}

graph.addNode("NodeA", NodeA);
graph.addNode("NodeB", NodeB);

graph.addEdge(START, "NodeA");
graph.addEdge("NodeA", "NodeB");
graph.addEdge("NodeB", END);

const workflow = graph.compile({ checkpointer });

const config = { configurable: { thread_id: "1" } };

const initialState = {
    Steps: [],
};

 await workflow.invoke(initialState, config);
console.log(await workflow.getState(config));
/*
{
  values: { Steps: [ 'NodeA', 'NodeB' ] },
  next: [],
  tasks: [],
  metadata: { source: 'loop', step: 2, parents: {}, thread_id: '1' },
  config: {
    configurable: {
      thread_id: '1',
      checkpoint_id: '1f0de601-de68-6a40-8002-ef930dbcba8d',
      checkpoint_ns: ''
    }
  },
  createdAt: '2025-12-21T11:28:04.836Z',
  parentConfig: {
    configurable: {
      thread_id: '1',
      checkpoint_ns: '',
      checkpoint_id: '1f0de601-de61-6510-8001-0b66725cb16a'
    }
  }
}
*/

const stateHistory = workflow.getStateHistory(config) // generator

console.log(await stateHistory.next()); // state data before END node
/*
{
  value: {
    values: { Steps: [Array] },
    next: [],
    tasks: [],
    metadata: { source: 'loop', step: 2, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:29:04.644Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
*/

console.log(await stateHistory.next()); // state data before NodeB node
/*
{
  value: {
    values: { Steps: [Array] },
    next: [ 'NodeB' ],
    tasks: [ [Object] ],
    metadata: { source: 'loop', step: 1, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:29:04.642Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
*/

console.log(await stateHistory.next()); // state data before NodeA node
/*
{
  value: {
    values: { Steps: [] },
    next: [ 'NodeA' ],
    tasks: [ [Object] ],
    metadata: { source: 'loop', step: 0, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:29:04.637Z',
    parentConfig: { configurable: [Object] }
  },
  done: false
}
*/

console.log(await stateHistory.next()); // state data before START node
/*
{
  value: {
    values: {},
    next: [ '__start__' ],
    tasks: [ [Object] ],
    metadata: { source: 'input', step: -1, parents: {}, thread_id: '1' },
    config: { configurable: [Object] },
    createdAt: '2025-12-21T11:29:04.624Z',
    parentConfig: undefined
  },
  done: false
}
*/

console.log(await stateHistory.next()); // end of generator
// { value: undefined, done: true }
