import { tool } from "langchain"; // Creates tool automatically
import * as z from "zod";

function add({ a, b }) {
    return a + b;
}

const addTool = tool((input) => add(input), {
    name: "add_numbers",
    description: "Add two numbers",
    schema: z.object({
        a: z.number(),
        b: z.number(),
    }),
});

const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);
