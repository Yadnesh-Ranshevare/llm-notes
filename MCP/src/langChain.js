import { DynamicStructuredTool } from "@langchain/core/tools";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { z } from "zod";

export async function createMcpClient() {
    const client = new Client(
        {
            name: "my-client",
            version: "1.0.0",
        },
        {
            capabilities: {
                sampling: {},
            },
        }
    );

    const transport = new StdioClientTransport({
        command: "node",
        args: ["src/index.js"],
        stderr: "ignore",
    });

    await client.connect(transport);
    return client;
}

const mcp = await createMcpClient();

const tool = new DynamicStructuredTool({
    name: "add",
    description: "Add two numbers",
    schema: z.object({ a: z.number(), b: z.number() }),
    func: async (input) => {
        const res = await mcp.callTool({ name: "add", arguments: input });
        return res;
    },
});

const res = await tool.invoke({ a: 5, b: 10 });
console.log(res);
// { content: [ { type: 'text', text: 'sum is 15' } ] }
