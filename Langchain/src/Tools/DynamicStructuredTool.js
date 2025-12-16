import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

async function add({ a, b }) {
    return a + b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const addTool = new DynamicStructuredTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    schema: schema,
    func: add,
});

const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);
