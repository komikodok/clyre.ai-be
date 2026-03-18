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
        default:
          return [];
      }
    });
  }

  static async getChatHistory(topic: string, user_id: string, limit?: number) {
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
      .sort({ created_at: -1 })
      .limit(limit)
      .select("role content created_at")
      .lean();

    const chatHistory = this.mapToBaseMessages(messages.reverse());

    return {
      sessionMessageId: sessionMessage._id,
      chatHistory,
      rawMessages: messages,
    };
  }

  static async deleteChatHistory(topic: string, user_id: string) {
    const topicDoc = await Topic.findOne({ name: topic });
    if (!topicDoc) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    const sessionMessage = await SessionMessage.findOne({
      user_id: user_id,
      topic_id: topicDoc._id,
    });

    if (!sessionMessage) {
      throw new ResponseError("Chat history not found", StatusCodes.NOT_FOUND);
    }

    const deleteResult = await ChatMessage.deleteMany({
      session_message_id: sessionMessage._id,
    });

    return {
      deletedCount: deleteResult.deletedCount,
      topic,
      user_id,
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
