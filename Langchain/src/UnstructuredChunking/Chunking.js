import { UnstructuredClient } from "unstructured-client";
import { Strategy } from "unstructured-client/sdk/models/shared";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";
import path from "path";
import zlib from "zlib";
import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents";
import { Chroma } from "@langchain/community/vectorstores/chroma";

const client = new UnstructuredClient({
    serverURL: "https://api.unstructuredapp.io/general/v0/general", // or a hard-coded URL
    security: {
        apiKeyAuth: process.env.VALID_API_KEY,
    },
});

async function chunkFile(filepath) {

    const fileBuffer = await fs.readFile(filepath);
    const fileName = path.basename(filepath);

    try {
        console.log("Uploading file for chunking:", fileName);
        const response = await client.general.partition({
            partitionParameters: {
                files: {
                    content: fileBuffer,
                    fileName: fileName,
                },
                extractImageBlockTypes: ["Image"],
                strategy: Strategy.Auto, // ✅ Use enum correctly
                chunkingStrategy: "by_title",
                maxCharacters: 3000,
                newAfterNChars: 2400,
                combineUnderNChars: 500,
            },
        });

        console.log("✅ SUCCESS! chunked complete.");
        // console.log(response[4]);

        function separate_content_types(elements) {
            const content_types = {
                text: elements.text,
                table: [],
                image: [],
                type: ["text"],
            };
            const org_element = elements.metadata.orig_elements;
            const buffer = Buffer.from(org_element, "base64");
            const decompressed = zlib.inflateSync(buffer);
            const data = JSON.parse(decompressed.toString());

            data.forEach((element) => {
                if (element.type === "Image") {
                    // console.log("Image Element:", element);
                    content_types.image.push(element.metadata.image_base64);
                    content_types.type.push("image");
                }
                if (element.type === "Table") {
                    // console.log("Table Element:", element);
                    content_types.table.push(element.metadata.text_as_html);
                    content_types.type.push("table");
                }
            });
            return content_types;
        }

        async function create_ai_enhanced_summary(text, table, image) {
            const llm = new ChatGoogleGenerativeAI({
                model: "models/gemini-2.5-flash",
                apiKey: process.env.API_KEY,
            });

            let prompt_text = `You are creating a searchable description for document content retrieval.
                        CONTENT TO ANALYZE:
                        TEXT CONTENT:
                        ${text}`;

            if (table.length > 0) {
                prompt_text += "Tables:\n";
                table.forEach((tbl, index) => {
                    prompt_text += `Table ${index + 1}:\n${tbl}\n`;
                });
                prompt_text += `
                YOUR TASK:
                Generate a comprehensive, searchable description that covers:

                1. Key facts, numbers, and data points from text and tables
                2. Main topics and concepts discussed  
                3. Questions this content could answer
                4. Visual content analysis (charts, diagrams, patterns in images)
                5. Alternative search terms users might use

                Make it detailed and searchable - prioritize findability over brevity.

                SEARCHABLE DESCRIPTION:
                `;
            }
            const message_content = [{ type: "text", text: prompt_text }];

            image.forEach((img) => {
                message_content.push({
                    type: "image_url",
                    image_url: { url: `data:image/jpeg;base64,${img}` },
                });
            });

            const message = new HumanMessage({
                content: message_content,
            });

            const result = await llm.invoke([message]);
            return result.content;
        }

        const langchain_document = [];

        for (const [idx, res] of response.entries()) {
            console.log(`---- Chunk ${idx + 1} ----`);
            const content_types = separate_content_types(res);
            console.log(`Tables Found: ${content_types.table.length}`);
            console.log(`Images Found: ${content_types.image.length}`);

            let EnhancedSummary = null;
            if (content_types.table.length > 0 || content_types.image.length > 0) {
                console.log("Creating AI-Enhanced Summary...");
                try {
                    const ai_summary = await create_ai_enhanced_summary(content_types.text, content_types.table, content_types.image);
                    EnhancedSummary = ai_summary;
                    console.log("AI-Enhanced Summary:", ai_summary);
                } catch (error) {
                    console.log("❌ Error generating AI summary:", error);
                }
            }

            langchain_document.push(
                new Document({
                    pageContent: EnhancedSummary ? EnhancedSummary : content_types.text,
                    metadata: {
                        original_content: JSON.stringify({
                            table: content_types.table,
                            image: content_types.image,
                            text: content_types.text,
                        }),
                    },
                })
            );
        }

        return langchain_document;
    } catch (error) {
        console.error("❌ Error details:", {
            message: error.message,
            status: error.statusCode,
            cause: error.cause?.message,
        });
    }
}

const chunks = await chunkFile("./src/UnstructuredChunking/unstructured.pdf");



// console.log(old_chunks[4]);
const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: process.env.API_KEY,
});

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

await vectorStore.addDocuments(chunks, { ids: old_chunks.map((_, idx) => (idx + 1).toString()) });

const query = "What are the two main components of the Transformer architecture? "


const similaritySearchResults = await vectorStore.similaritySearch(query, 2);
console.log("Similarity Search Results:", similaritySearchResults);