import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const prompt1 = new PromptTemplate({
    template: "create a point wise summary of the following text:\n\n{input}",
    inputVariables: ["input"],
});

const prompt2 = new PromptTemplate({
    template: "generate 2 questions from the following topic:\n\n{input}",
    inputVariables: ["input"],
});

const prompt3 = new PromptTemplate({
    template:"jest merge the following summary and questions into a single json object with keys 'summary' and 'questions':\n\nSummary:\n{summary}\n\nQuestions:\n{questions}",
    inputVariables: ["summary", "questions"],
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const parser = new StringOutputParser();

const data = `Artificial Intelligence, or AI, is a technology that allows computers to think and learn like humans.
AI can understand language, recognize images, and make decisions based on data.
Examples of AI include voice assistants like Siri and Alexa, recommendation systems on Netflix, and chatbots.
AI is used in many fields such as healthcare, education, banking, and transportation.
The main goal of AI is to make machines smarter so they can help humans work faster and better.`;

const chain1 = prompt1.pipe(llm).pipe(parser);
const chain2 = prompt2.pipe(llm).pipe(parser);
const chain3 = prompt3.pipe(llm).pipe(parser);

const parallelChian = RunnableParallel.from({
    summary: chain1,
    questions: chain2,
});

const combinedChain = parallelChian.pipe(chain3);

const result = await combinedChain.invoke({ input: data });
console.log(result);


/*
output:
{
  "summary": "Here's a point-wise summary of the provided text:\n\n*   AI (Artificial Intelligence) is a technology that enables computers to think and learn like humans.\n*   It can understand language, recognize images, and make decisions based on data.\n*   Examples include voice assistants (Siri, Alexa), Netflix recommendation systems, and chatbots.\n*   AI is utilized in diverse fields such as healthcare, education, banking, and transportation.\n*   Its main goal is to make machines smarter to help humans work faster and more efficiently.",
  "questions": "Here are two questions based on the provided topic:\n\n1.  According to the text, what are two capabilities of Artificial Intelligence, and name one example of AI?\n2.  What is the main goal of Artificial Intelligence, and in which fields is it used?"
}
*/