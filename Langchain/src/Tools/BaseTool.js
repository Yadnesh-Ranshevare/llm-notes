import { BaseTool } from "@langchain/core/tools";
import { z } from "zod";

class AddTool extends BaseTool {
  name = "add_numbers";
  description = "Add two numbers";

  schema = z.object({
    a: z.number(),
    b: z.number(),
  });

  async _call({ a, b }) {
    return String(a + b);
  }
}

const addTool = new AddTool();
const result = await addTool.invoke({ a: 5, b: 10 });
console.log(result);