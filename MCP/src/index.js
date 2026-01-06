import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
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
            content: [{ type: "text", text: `ans is ${a - b}` }],
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
        }),
    },
    async ({ a, b }) => {
        return {
            content: [{ type: "text", text: `sum is ${a + b}` }],
        };
    }
);

server.resource(
    "data",
    "data://data",
    {
        description: "return the array of random number",
        title: "random number",
        mimeType: "application/json",
    },
    async (uri) => {
        return {
            contents: [{ uri: uri.href, text: JSON.stringify([1, 2, 3, 4, 5]), mimeType: "application/json" }],
        };
    }
);

server.resource(
    "resource template basic",
    new ResourceTemplate("data://{data}", { list: undefined }),
    {
        title: "return number",
        description: "return the the number user input",
        mimeType: "application/json",
    },
    async (uri, { data }) => {
        return {
            contents: [{ uri: uri.href, text: JSON.stringify(data), mimeType: "application/json" }],
        };
    }
);

server.resource(
    "resource template implementing list",
    new ResourceTemplate("data://list/{data}", {
        list: async (_extra) => {
            const items = [
                { id: "1", value: 10 },
                { id: "2", value: 20 },
            ];

            return {
                resources: items.map((item) => ({
                    uri: `data://${item.id}`,
                    name: item.id, // required
                    title: `Item ${item.id}`, // optional
                    description: `Value: ${item.value}`,
                    mimeType: "application/json",
                })),
                // nextCursor: undefined,        // add this if you support pagination
            };
        },
    }),
    {
        title: "return number",
        description: "return the the number user input",
        mimeType: "application/json",
    },
    async (uri, { data }) => {
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(data),
                    mimeType: "application/json",
                },
            ],
        };
    }
);

server.resource(
    "resource template implementing complete",
    new ResourceTemplate("data://complete/{data}", {
        list: undefined,
        complete: {
            data: async (value) => {
                if (value == "yes") {
                    return ["op1", "op2"];
                }
            },
        },
    }),
    {
        title: "return number",
        description: "return the the number user input",
        mimeType: "application/json",
    },
    async (uri, { data }) => {
        return {
            contents: [{ uri: uri.href, text: JSON.stringify(data), mimeType: "application/json" }],
        };
    }
);



server.prompt(
    "example-prompt",
    "example prompt",
    {
        name: z.string(),
        age: z.number(),
    },
    async ({ name }) => {
        return {
            messages: [
                {
                    role: "user",
                    content: {
                        type: "text",
                        text: `hi ${name} your age is ${age}`,
                    },
                },
            ],
        };
    }
);

await server.connect(new StdioServerTransport());
