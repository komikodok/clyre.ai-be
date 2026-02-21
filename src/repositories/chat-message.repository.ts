import ChatMessage from "../models/chat-message.model";
import SessionMessage from "../models/session-message.model";
import Topic from "../models/topic.model";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  ToolMessage,
} from "@langchain/core/messages";
import mongoose from "mongoose";
import ResponseError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class ChatMessageRepository {
  private static mapToBaseMessages(messages: any[]): BaseMessage[] {
    return messages.flatMap((msg): BaseMessage[] => {
      switch (msg.role) {
        case "user":
          return [new HumanMessage({ content: msg.content })];
        case "assistant":
          return [
            new AIMessage({
              content: msg.content,
              tool_calls: msg.tool_calls || [],
            }),
          ];
        // case "tool":
        //   return [
        //     new ToolMessage({
        //       content: msg.content as string,
        //       tool_call_id: msg.tool_call_id!,
        //     }),
        //   ];
        default:
          return [];
      }
    });
  }

  static async getChatHistory(
    topic: string,
    user_id: string,
    limit: number = 4,
  ) {
    const topicDoc = await Topic.findOne({ name: topic });
    if (!topicDoc) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    const sessionMessage = await SessionMessage.findOneAndUpdate(
      { user_id: user_id, topic_id: topicDoc._id },
      { $setOnInsert: { user_id: user_id, topic_id: topicDoc._id } },
      { upsert: true, new: true },
    );

    const messages = await ChatMessage.find({
      session_message_id: sessionMessage._id,
    })
      .sort({ created_at: 1 })
      .limit(limit);

    const chatHistory = this.mapToBaseMessages(messages);

    return {
      sessionMessageId: sessionMessage._id,
      chatHistory,
      rawMessages: messages,
    };
  }

  static async saveMessages(
    sessionMessageId: mongoose.Types.ObjectId,
    messages: {
      role: string;
      content: string;
      tool_calls?: any[];
      tool_call_id?: string;
    }[],
  ) {
    const docs = messages.map((msg) => ({
      session_message_id: sessionMessageId,
      role: msg.role,
      content: msg.content,
      tool_calls: msg.tool_calls || [],
      tool_call_id: msg.tool_call_id || null,
      created_at: new Date(),
    }));

    await ChatMessage.insertMany(docs);
  }
}

export default ChatMessageRepository;
