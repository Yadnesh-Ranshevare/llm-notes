import { Chroma } from "@langchain/community/vectorstores/chroma";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";

async function retrievalPipeline(Query, k) {
    const embeddings = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004",
        apiKey: process.env.API_KEY,
    });

    // vector store logic here
    const vectorStore = new Chroma(embeddings, {
        collectionName: "a-test-collection",
        chromaCloudAPIKey: process.env.CHROMA_API_KEY,
        clientParams: {
            host: "api.trychroma.com",
            port: 8000,
            ssl: true,
            tenant: process.env.CHROMA_TENANT,
            database: process.env.CHROMA_DATABASE,
        },
    });

    const results = await vectorStore.similaritySearch(Query, k);
    // console.log("Similarity Search Results:", results);
    return results;
}

// console.log(process.env.API_KEY)
const llm = new ChatGoogleGenerativeAI({
    model: "models/gemini-2.5-flash",
    apiKey: process.env.API_KEY,
});

const chatHistory = [];

async function ask_question(user_question) {
    let searchQuestion = null;
    if (chatHistory.length > 0) {
        const messages = [
            new SystemMessage(
                "Given the chat history, rewrite the new question to be standalone and searchable. Just return the rewritten question."
            ),
            ...chatHistory,
            new HumanMessage(`New question: ${user_question}`),
        ];

        const result = await llm.invoke(messages);
        searchQuestion = result.content.trim();
        console.log(`Searching for: ${searchQuestion}`);
    } else {
        searchQuestion = user_question;
    }
    const res = await retrievalPipeline(searchQuestion, 3);
    const combinedInput = `Based on the following documents, please answer this question: ${user_question}

    Documents:
    ${res.map((doc) => `- ${doc.pageContent}`).join("\n")}

    Please provide a clear, helpful answer using only the information from these documents. If you can't find the answer in the documents, say "I don't have enough information to answer that question based on the provided documents."`;

    // Step 4: Get the answer
    const messages = [
        new SystemMessage("You are a helpful assistant that answers questions based on provided documents and conversation history."),
        ...chatHistory,
        new HumanMessage(combinedInput),
    ];

    const answer = await llm.invoke(messages);
    // console.log("Answer:", answer.content);

    chatHistory.push(new HumanMessage(user_question));
    chatHistory.push(new AIMessage(answer.content));

    return answer.content;
}

const query = "when google was founded?";
const followUpQuestion = "who are the founded it?";

console.log("----- Initial Question -----");
const answer = await ask_question(query);
console.log(answer);
console.log("----- Follow-up Question -----");
const followUpAnswer = await ask_question(followUpQuestion);
console.log(followUpAnswer);
