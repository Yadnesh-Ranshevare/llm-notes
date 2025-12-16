import { DynamicTool } from "@langchain/core/tools";

function add(a, b) {
    return a + b;
}

const addTool = new DynamicTool({
    name: "add_numbers",
    description: "Adds two numbers together",
    func: async (input) => {
        const { a, b } = JSON.parse(input);
        return add(a, b).toString();
    },
});

const result = await addTool.invoke(JSON.stringify({ a: 5, b: 10 }));
console.log(result);

// const addTool = new DynamicTool({
//     name: "add_numbers",
//     description: "Adds two numbers together",
//     func: async (input) => {
//         console.log(input)
//     },
// });

// await addTool.invoke({ a: 5, b: 10 });