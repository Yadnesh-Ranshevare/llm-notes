import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch } from "@langchain/core/runnables";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
// import { RunnableSequence } from "@langchain/core/runnables";

import { z } from "zod";

const schema = z.object({
    sentiment: z.enum(["positive", "negative"]),
});

const json_parser = StructuredOutputParser.fromZodSchema(schema);

const prompt1 = new PromptTemplate({
    template: "classify the sentiment of the following review as positive, negative\n\n{review}\n\n{pares}",
    inputVariables: ["review"],
    partialVariables: { pares: json_parser.getFormatInstructions() },
});

const prompt2 = new PromptTemplate({
    template: "tell one positive response to the user following sentiment:\n\n{sentiment}",
    inputVariables: ["sentiment"],
});

const prompt3 = new PromptTemplate({
    template: "tell one negative response to the user the following sentiment:\n\n{sentiment}",
    inputVariables: ["sentiment"],
});

const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const classifierChain = prompt1.pipe(llm).pipe(json_parser);

const positiveChain = prompt2.pipe(llm).pipe(new StringOutputParser());

const negativeChain = prompt3.pipe(llm).pipe(new StringOutputParser());

const generalChain = new PromptTemplate({
    template: "tell user to fill proper feedback in 1 to 2 sentences.",
    inputVariables: [],
}).pipe(llm).pipe(new StringOutputParser());

const branch_chain = RunnableBranch.from([
    [(input) => input.sentiment === "positive", positiveChain],
    [(input) => input.sentiment === "negative", negativeChain],
    generalChain,
]);

// use this syntax if you want to pass specific inputs to the branches which are different from the input of first chain
// const combine_chain = RunnableSequence.from([
//   {      // this object will be passed as input to the branch_chain
//     review: (input) => input.review,
//     sentiment: classifierChain,
//   },
//   branch_chain,
// ]);

const combine_chain = classifierChain.pipe(branch_chain);

const result = await combine_chain.invoke({ review: "The product quality is excellent and exceeded my expectations!" });
console.log(result);

// output = That's wonderful to hear!
