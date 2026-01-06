import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
    capabilities: {
        tools: {},      
        resources: {},
    },
});

server.tool(
    "subtract",
    "subtract two numbers",
    {
        a: z.number(),
        b: z.number(),
    },
    async ({ a, b }) => {
        return {
            content:[{type:"text", text:`ans is ${a-b}`}]
        };
    }
);

server.registerTool(
    "add",
    {
        title: "Add",
        description: "Add two numbers",
        inputSchema: z.object({
            a: z.number(),
            b: z.number(),
        })
    },
    async ({ a, b }) => {
        return {
            content:[{type:"text", text:`sum is ${a+b}`}]
        };
    }
)

await server.connect(new StdioServerTransport());


