import z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

const ActivitySchema = z.object({
    time: z.enum(["Morning", "Afternoon", "Evening"]),
    activity: z.string(),
});

const StructuredOutputSchema = z.array(ActivitySchema);

const unstructuredModel = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const structuredModel = unstructuredModel.withStructuredOutput(StructuredOutputSchema);

const query = "Can you create a one-day travel arrangements for paris";

const response = await structuredModel.invoke(query);
console.log("Structured Response:", response);
/*
Structured Response: [
  {
    time: 'Morning',
    activity: 'Visit the Eiffel Tower and take a walk along the Seine River.'
  },
  {
    time: 'Afternoon',
    activity: 'Explore the Louvre Museum and enjoy lunch nearby.'
  },
  {
    time: 'Evening',
    activity: 'Dine in Montmartre and visit the Sacré-Cœur Basilica for sunset views.'
  }
]
*/