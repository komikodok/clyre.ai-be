import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { StructuredTool } from "langchain";
import { topicDecisionTool } from "../tools/topic-decision.tool";


dotenv.config({ path: ".env" });

export const createChatModel = (temperature: number = 0.7) => {
    return new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: process.env.MODEL_NAME || "llama-3.3-70b-versatile",
        temperature,
    });
};

export const createChain = (
    systemPrompt: string,
    temperature: number = 0.2,
    tools: StructuredTool[] = [topicDecisionTool]
) => {
    const model = tools.length > 0
        ? createChatModel(temperature).bindTools(tools)
        : createChatModel(temperature);

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["system", `
            Always use GitHub-flavored Markdown for normal responses.
            When calling tools or returning structured output, follow the required JSON format strictly.`
        ],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"]
    ]);

    return RunnableSequence.from([prompt, model]);
};
