import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import dotenv from "dotenv";
import { StructuredTool } from "langchain";
import { switchTopicTool } from "../tools/switch-topic-tool";
import { followupSuggestionTool } from "../tools/followup_suggestion_tool";

dotenv.config({ path: ".env" });

export const createChatModel = (temperature: number = 0.7) => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.MODEL_NAME || "llama-3.3-70b-versatile",
    temperature,
    streaming: true,
  });
};

export const createChain = (
  systemPrompt: string,
  temperature: number = 0.7,
  tools: StructuredTool[] = [switchTopicTool, followupSuggestionTool]
) => {
  const model =
    tools.length > 0
      ? createChatModel(temperature).bindTools(tools)
      : createChatModel(temperature);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    [
      "system",
      `
          Always use GitHub-flavored Markdown for formatting.
          
          You have access to several tools. Use them when appropriate:
          - ALWAYS write a complete, helpful natural language response to the user FIRST.
          - You may call multiple tools in a single turn if needed
          - Only call tools when they add clear value
          
          When calling tools, follow the required schema format.

          Always respond in the same language as the user's most recent message.
          Never mention language detection, translation, or reasoning.
          If the user switches language, follow the new language immediately.
          IMPORTANT: Always respond in the same language as the user's input.
        `,
    ],
    ["placeholder", "{chat_history}"],
    ["human", "{input}"],
  ]);

  return RunnableSequence.from([prompt, model]);
};
