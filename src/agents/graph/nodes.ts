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

  // Un-comment this line to see the total tokens used
  console.log(
    `Total tokens: ${JSON.stringify(aiMsg?.response_metadata?.usage?.total_tokens)}`,
  );

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

  console.log(toolResultsText);

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
    input: "",
    username,
    tool_results: toolResultsText,
  });

  console.log(
    `Total tokens: ${JSON.stringify(aiMsg?.response_metadata?.usage?.total_tokens)}`,
  );

  return {
    result: aiMsg.content,
  };
};

// export const finalToolNode = async (state: AgentExecutorState) => {
//   const { input, result, tool_calls, tool_result, chat_history, username } =
//     state;

//   const toolResultsText = tool_calls
//     .map((toolCall, index) => {
//       const toolResult = tool_result[index];
//       const toolName = toolCall.name.toUpperCase();

//       return `${toolName}\n ${JSON.stringify(toolResult)}`;
//     })
//     .join("\n")
//     .replace(/{/g, "")
//     .replace(/}/g, "");

//   console.log(toolResultsText);

//   const model = createChatModel();

//   const systemPrompt = `
//     You are an assistant finishing a conversation.

//     Always use GitHub-flavored Markdown for formatting.
//     Respond in user's language.

//     User name: ${username}

//     The assistant previously responded:
//     ${result}

//     Additional information from tools:
//     ${toolResultsText}

//     Combine everything into a clear, natural, user-facing answer.
//     DO NOT mention tools, functions, JSON, or internal reasoning.
//     Just answer the user.
//   `;
//   const prompt = ChatPromptTemplate.fromMessages([
//     ["system", systemPrompt],
//     ["placeholder", "{chat_history}"],
//     ["human", "{input}"],
//   ]);

//   const chain = RunnableSequence.from<any, any>([prompt, model]);

//   const aiMsg = await chain.invoke({
//     input,
//     chat_history,
//   });

//   console.log(
//     `Total tokens: ${JSON.stringify(aiMsg?.response_metadata?.usage?.total_tokens)}`,
//   );

//   return {
//     result: aiMsg.content,
//   };
// };

// export const finalToolNode = async (state: AgentExecutorState) => {
//   const { result, tool_result, chat_history } = state;

//   const toolResultsText = tool_result
//     .map((result) => JSON.stringify(result))
//     .join("\n")
//     .replace(/{/g, "") // escape
//     .replace(/}/g, "");

//   const model = createChatModel();

//   const finalSystemPrompt = `
//       You are an editor assistant.

//       Your role is NOT to start a new conversation.
//       Your role is NOT to change the topic.
//       Your role is NOT to add new ideas unless explicitly provided.

//       You will be given:
//       1. A draft answer already shown to the user
//       2. Additional internal information

//       Your task:
//       - Improve clarity and flow
//       - Integrate the additional information naturally
//       - Preserve the original intent, topic, and tone
//       - Do NOT restart the response
//       - Do NOT ask new questions
//       - Do NOT mention tools or internal processes
//   `;

//   const prompt = ChatPromptTemplate.fromMessages([
//     ["system", finalSystemPrompt],
//     ["human", "{input}"],
//   ]);

//   const chain = RunnableSequence.from<any, any>([prompt, model]);
//   const ai_msg = await chain.invoke({
//     input: `Tool result: ${toolResultsText}`,
//   });

//   console.log(`AI msg: ${ai_msg.content}`);
//   console.log(`Tool result: ${toolResultsText}`);
//   // Un-comment this line to see the total tokens used
//   console.log(
//     `Total tokens: ${JSON.stringify(ai_msg?.response_metadata?.usage?.total_tokens)}`,
//   );

//   return {
//     result: `${result}\n${ai_msg.content}`,
//   };
// };
