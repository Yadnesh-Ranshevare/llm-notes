import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { START, END, StateGraph } from "@langchain/langgraph";
import { z } from "zod";
import "dotenv/config";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const generator_llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const evaluator_llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const evaluation_schema = z.object({
    evaluation: z.enum(["good", "needs improvement"]),
    feedback: z.string(),
});

const structured_llm = evaluator_llm.withStructuredOutput(evaluation_schema)

const optimizer_llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.LLM_API_KEY,
});

const GraphState = z.object({
    topic: z.string(),
    post: z.string(),
    evaluation: z.enum(["good", "needs improvement"]),
    feedback: z.string(),
    iteration: z.number(),
    max_iterations: z.number(),
});

const graph = new StateGraph(GraphState);

async function generatePost(state) {
    const message = [
        new SystemMessage("You are a funny and clever Twitter/X influencer."),
        new HumanMessage(
            `Write a short, original, and hilarious tweet on the topic: "${state.topic}".

Rules:
- Do NOT use question-answer format.
- Max 280 characters.
- Use observational humor, irony, sarcasm, or cultural references.
- Think in meme logic, punchlines, or relatable takes.
- Use simple, day to day english`
        ),
    ];
    const post = await generator_llm.invoke(message);
    return { post: post.content };
}
graph.addNode("generate_post", generatePost);

async function evaluatePost(state){
    const message = [
        new SystemMessage("You are a ruthless, no-laugh-given Twitter critic. You evaluate tweets based on humor, originality, virality, and tweet format."),
        new HumanMessage(
            `Evaluate the following tweet:

Tweet: "${state.post}"

Use the criteria below to evaluate the tweet:

1. Originality – Is this fresh, or have you seen it a hundred times before?  
2. Humor – Did it genuinely make you smile, laugh, or chuckle?  
3. Punchiness – Is it short, sharp, and scroll-stopping?  
4. Virality Potential – Would people retweet or share it?  
5. Format – Is it a well-formed tweet (not a setup-punchline joke, not a Q&A joke, and under 280 characters)?

Auto-reject if:
- It's written in question-answer format (e.g., "Why did..." or "What happens when...")
- It exceeds 280 characters
- It reads like a traditional setup-punchline joke
- Dont end with generic, throwaway, or deflating lines that weaken the humor (e.g., “Masterpieces of the auntie-uncle universe” or vague summaries)

### Respond ONLY in structured format:
- evaluation: "good" or "needs improvement"  
- feedback: One paragraph explaining the strengths and weaknesses`
        )
    ]

    const response = await structured_llm.invoke(message);
    return { evaluation: response.evaluation, feedback: response.feedback };
}
graph.addNode("evaluate_post", evaluatePost);

async function optimizePost(state){
    const message = [
        new SystemMessage("You punch up tweets for virality and humor based on given feedback."),
        new HumanMessage(
            `
Improve the tweet based on this feedback:
"${state.feedback}"

Topic: "${state.topic}
Original Tweet:
${state.post}

Re-write it as a short, viral-worthy tweet. Avoid Q&A style and stay under 280 characters.
            `
        )
    ]

    const response = await optimizer_llm.invoke(message);
    return { post: response.content , iteration: state.iteration + 1 };
}
graph.addNode("optimize_post", optimizePost);

function condition(state){
    if (state.evaluation === "needs improvement" && state.iteration < state.max_iterations){
        return "optimize_post";
    } else {
        return END;
    }
}

graph.addEdge(START, "generate_post");
graph.addEdge("generate_post", "evaluate_post");
graph.addConditionalEdges("evaluate_post", condition);
graph.addEdge("optimize_post", "evaluate_post");

const workflow = graph.compile();

const initialState = {
    topic: "AI",
    iteration: 1,
    max_iterations: 5,
};
const res = await workflow.invoke(initialState);
console.log(res);

/*
{
  topic: 'AI',
  post: `Just asked an AI to write me a witty tweet about AI. It replied, "As a large language model..." We're definitely ready for world domination, just not for original intros. #AI #RobotsAreComing`,
  evaluation: 'good',
  feedback: "This tweet effectively captures a relatable AI experience with a sharp, observational humor that lands well for the Twitter format. It's concise, avoiding generic intros for its own punchline, and the hashtags are relevant, enhancing its discoverability and virality potential among tech-savvy audiences. While the core concept of AI being unoriginal is not entirely new, the specific execution and self-awareness of the tweet make it feel fresh and genuinely amusing, making it highly shareable.",
  iteration: 1,
  max_iterations: 5
}
*/