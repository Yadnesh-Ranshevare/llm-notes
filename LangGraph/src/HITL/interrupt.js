import { Annotation, END, interrupt, START, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";

const schema = Annotation.Root({
    message: Annotation({
        schema: z.array(z.instanceof(BaseMessage)),
        reducer: (prev, next) => prev.concat(next),
        default: () => [],
    }),
});

const graph = new StateGraph(schema);

async function interrupt_Node(state) {
    interrupt({ message: "Need human approval" });
}

graph.addNode("interrupt_Node", interrupt_Node);

graph.addEdge(START, "interrupt_Node");
graph.addEdge("interrupt_Node", END);

const workflow = graph.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: "1" } };

const res = await workflow.invoke({ message: [new HumanMessage("hey")] }, config);
console.log(res);
console.log(res.__interrupt__);


/*
{
  message: [
    HumanMessage {
      "content": "hey",
      "additional_kwargs": {},
      "response_metadata": {}
    }
  ],
  __interrupt__: [ { id: '5cfdb2806ec369e3da51fd1b7e6c5a1a', value: [Object] } ]
}
[
  {
    id: '5cfdb2806ec369e3da51fd1b7e6c5a1a',
    value: { message: 'Need human approval' }
  }
]
*/
