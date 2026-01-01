import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { StructuredTool } from "langchain";
import { topicDecisionTool } from "../tools/topic-decision.tool";
import { followupQuestionTool } from "../tools/followup_question_tool";


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
    temperature: number = 0.8,
    tools: StructuredTool[] = [topicDecisionTool, followupQuestionTool]
) => {
    const model = tools.length > 0
        ? createChatModel(temperature).bindTools(tools)
        : createChatModel(temperature);

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["system", `
            Always use GitHub-flavored Markdown for formatting.
            
            You have access to several tools. Use them when appropriate:
            - You may call multiple tools in a single turn if needed
            - Only call tools when they add clear value
            
            When calling tools, follow the required schema format.
        `],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"]
    ]);

    return RunnableSequence.from([prompt, model]);
};
