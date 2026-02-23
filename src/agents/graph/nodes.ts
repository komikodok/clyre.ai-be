import { END } from "@langchain/langgraph";
import { chains } from "../chains";
import { AgentExecutorState } from "./agent-executor";
import { toolExecutor } from "../utils/tool-executor";
import { logger } from "../../utils/logging";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { createEmbeddings } from "../utils/chain-factory";
import mongoose from "mongoose";
import { createChain, createChatModel } from "../utils/chain-factory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

export const retrieveDocsNode = async (state: AgentExecutorState) => {
  const { topic, input } = state;

  try {
    if (!topic || topic === "general") {
      return { retrieved_context: "" };
    }

    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }

    const collectionName = `${topic}_docs`;

    const collection = mongoose.connection.db.collection(collectionName) as any;

    const embeddings = await createEmbeddings();

    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
      collection,

      indexName: "default",

      textKey: "text",

      embeddingKey: "embedding",
    });

    const results = await vectorStore.similaritySearch(input, 1);

    const retrievedContext = results
      .map((doc) => doc.pageContent)
      .filter(Boolean)
      .join("\n\n");

    return {
      retrieved_context: retrievedContext,
    };
  } catch (err) {
    logger.error("Error retrieving documents", err);

    throw new Error("Failed to retrieve documents");
  }
};

export const agentNode = async (state: AgentExecutorState) => {
  const { topic, input, chat_history, retrieved_context, username } = state;

  const activeChain = chains[topic as keyof typeof chains] || chains["general"];

  const optimizedContext = !!retrieved_context
    ? `Context: ${retrieved_context.substring(0, 300)}`
    : "";

  const contextualInput = `
    ${optimizedContext}\n\n

    USER NAME: ${username}\n\n
    
    USER INPUT: ${input}\n\n
  `;

  const aiMsg = await activeChain.invoke({
    input: contextualInput,
    chat_history,
  });

  return {
    result: aiMsg.content,
    tool_calls: aiMsg.tool_calls,
  };
};

export const executeToolOrReturn = (state: AgentExecutorState) => {
  const { tool_calls } = state;

  if (tool_calls?.length > 0) {
    return "executeToolNode";
  }

  return END;
};

export const executeToolNode = async (state: AgentExecutorState) => {
  const { tool_calls } = state;

  const executeTools = await toolExecutor(tool_calls, state);

  return {
    tool_result: executeTools,
  };
};

export const finalToolNode = async (state: AgentExecutorState) => {
  const { input, result, tool_calls, tool_result, chat_history, username } =
    state;

  const toolResultsText = tool_calls
    .map((toolCall, index) => {
      const toolResult = tool_result[index];
      const toolName = toolCall.name.toUpperCase();

      return `${toolName}\n ${JSON.stringify(toolResult)}`;
    })
    .join("\n")
    .replace(/{/g, "")
    .replace(/}/g, "");

  const systemPrompt = `
    User name: {username}

    Additional information from tools:
    {tool_results}

    Combine everything into a clear, natural, user-facing answer.
    DO NOT mention tools, functions, JSON, or internal reasoning.
    Just answer the user.
  `;

  const chain = createChain(systemPrompt, 0.7, []);
  const aiMsg = await chain.invoke({
    input,
    username,
    tool_results: toolResultsText,
  });

  return {
    result: aiMsg.content,
  };
};
