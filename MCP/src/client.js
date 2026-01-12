import {Client} from "@modelcontextprotocol/sdk/client"
import {StdioClientTransport} from "@modelcontextprotocol/sdk/client/stdio.js"

const client = new Client(
    {
        name: "my-client",
        version: "1.0.0",
    },
    {
        capabilities:{
            sampling:{}
        }
    }
)

const transport = new StdioClientTransport({
    command: "node",
    args: ["src/index.js"],
    stderr:"ignore"
}) 

console.log("Connecting...")
await client.connect(transport)
console.log("Connected")
const tools = await client.listTools()
console.log(tools)

const prompt = await client.listPrompts()
console.log(prompt)

const resource = await client.listResources()
console.log(resource)