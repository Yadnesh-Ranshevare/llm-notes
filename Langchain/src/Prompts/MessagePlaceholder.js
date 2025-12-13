import { MessagesPlaceholder, ChatPromptTemplate } from "@langchain/core/prompts";

const chatHistory = [
    {
        type: "human",
        content: "What is vector search?",
    },
    {
        type: "ai",
        content: "Vector search is a technique used to find similar items based on their vector representations.",
    },
];

const chatPrompt = ChatPromptTemplate.fromMessages([["system", "You are a coding tutor."], new MessagesPlaceholder("history"), ["human", "{input}"]]);

const result = await chatPrompt.format({
    history: chatHistory, // Pass chat history array
    input: "How does vector search work?",
});
console.log(result);
