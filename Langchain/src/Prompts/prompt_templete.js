import { PromptTemplate } from "@langchain/core/prompts";

const prompt = new PromptTemplate({
    template: `You are a helpful assistant.
        Explain the following {language} code:
        {code}`,
    inputVariables: ["language", "code"],
});

const finalPrompt = await prompt.format({
  language: "JavaScript",
  code: "function sum(a,b){ return a+b; }"
});

console.log(finalPrompt);