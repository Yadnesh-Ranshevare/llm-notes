import { ChatPromptTemplate } from "@langchain/core/prompts";

const chat_template = ChatPromptTemplate.fromMessages([
    ["system", "You are a React tutor."],
    ["human", "{question}"],
]);


const messages = await chat_template.format({
  question: "What is useState?"
});

console.log(messages);