import { END } from "@langchain/langgraph";

import { chains } from "../chains";

import { AgentExecutorState } from "./agent-executor";

import { HumanMessage, ToolMessage } from "@langchain/core/messages";

import { toolExecutor } from "../utils/tool-executor";

import { logger } from "../../utils/logging";

import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import { createEmbeddings } from "../utils/chain-factory";

import mongoose from "mongoose";

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

  let optimizedContext = "";

  if (retrieved_context) {
    const maxContextLength = 300;

    optimizedContext =
      retrieved_context.length > maxContextLength
        ? retrieved_context.substring(0, maxContextLength) + "..."
        : retrieved_context;
  }

  const contextualInput = optimizedContext
    ? `${optimizedContext}\n\nUser name is ${username}\nInput: ${input}`
    : `User name is ${username}\nInput: ${input}`;

  const human_msg = new HumanMessage({ content: contextualInput });

  const ai_msg = await activeChain.invoke({
    input: contextualInput,
    chat_history,
  });

  // console.log(
  //   `Total tokens: ${JSON.stringify(ai_msg?.response_metadata?.usage?.total_tokens)}`,
  // );

  return {
    result: ai_msg.content,

    chat_history: [human_msg, ai_msg],

    tool_calls: ai_msg.tool_calls,
  };
};

export const executeToolOrReturn = (state: AgentExecutorState) => {
  const { tool_calls } = state;

  if (tool_calls?.length > 0) {
    return "toolNode";
  }

  return END;
};

export const toolNode = async (state: AgentExecutorState) => {
  let newTopic: string | undefined;

  const { tool_calls } = state;

  const toolMessages = tool_calls.map((tool) => {
    if (tool.name === "topic_decision_tool") {
      newTopic = tool.args.suggested_topic;
    }

    const toolMsg = new ToolMessage({
      tool_call_id: tool.id,

      content: JSON.stringify(tool),
    });

    return toolMsg;
  });

  const executeTools = await toolExecutor(tool_calls);

  return {
    chat_history: [...toolMessages],

    tool_result: executeTools,

    topic: newTopic,
  };
};
