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

await client.connect(transport)

const tools = await client.listTools()
console.log(tools)
/*
{
  tools: [
    {
      name: 'subtract',
      description: 'subtract two numbers',
      inputSchema: [Object],
      execution: [Object]
    },
    {
      name: 'add',
      title: 'Add',
      description: 'Add two numbers',
      inputSchema: [Object],
      execution: [Object]
    }
  ]
}
*/

const prompt = await client.listPrompts()
console.log(prompt)
/*
{
  prompts: [
    {
      name: 'example-prompt',
      description: 'example prompt',
      arguments: [Array]
    }
  ]
}
*/

const resource = await client.listResources()
console.log(resource)
/*
{
  resources: [
    {
      name: 'data',
      title: 'random number',
      uri: 'data://data',
      description: 'return the array of random number',
      mimeType: 'application/json'
    },
    {
      name: '1',
      title: 'Item 1',
      uri: 'data://1',
      description: 'Value: 10',
      mimeType: 'application/json'
    },
    {
      name: '2',
      title: 'Item 2',
      uri: 'data://2',
      description: 'Value: 20',
      mimeType: 'application/json'
    }
  ]
}
*/


const sum = await client.callTool({
    name:"add",
    arguments:{a:1,b:2}
})
console.log(sum)
// { content: [ { type: 'text', text: 'sum is 3' } ] }

const resources = await client.readResource({uri:"data://1"})
console.log(resources)
// { contents: [ { uri: 'data://1', mimeType: 'application/json', text: '"1"' } ] }

const callPrompt = await client.getPrompt({
    name:"example-prompt",
    arguments:{name:"yadnesh",age:"20"}
}) 
console.log(callPrompt)
// { messages: [ { role: 'user', content: { type: 'text', text: 'hi yadnesh your age is 20' } } ] }


