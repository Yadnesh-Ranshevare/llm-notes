import "dotenv/config";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

async function multiply({ a, b }) {
    return a * b;
}
const schema = z.object({
    a: z.number(),
    b: z.number(),
});

const multiplyTool = new DynamicStructuredTool({
    name: "multiply_numbers",
    description: "Multiplies two numbers",
    schema: schema,
    func: multiply,
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const llm_with_tool = llm.bindTools([multiplyTool]);

// const response1 = await llm_with_tool.invoke("Multiply 5 and 10.");
// console.log("response for multiply query");
// console.log(response1.tool_calls);

// const response2 = await llm_with_tool.invoke("hey");
// console.log("response for normal query");
// console.log(response2.tool_calls);

// const response3 = await llm_with_tool.invoke("Multiply 5 and 10.");
// console.log(response3.content[0].functionCall.args);
// console.log(response3.tool_calls)

const response = await llm_with_tool.invoke("Multiply 5 and 10.");
// const args = response.tool_calls[0].args
// const ans = await multiplyTool.invoke(args)
const ans = await multiplyTool.invoke(response.tool_calls[0])
console.log(ans);