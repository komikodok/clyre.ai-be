import mongoose from "mongoose";
import ChatMessage from "../models/chat-message.model";
import SessionMessage from "../models/session-message.model";
import Topic from "../models/topic.model";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { IChatMessage } from "../types/message.type";
import ResponseError from "../utils/error";
import { StatusCodes } from "http-status-codes";

class ChatMessageRepository {
  static async getChatHistory(topic: string, user_id: string) {
    const topicDoc = await Topic.findOne({ name: topic });
    if (!topicDoc) {
      throw new ResponseError("Topic not found", StatusCodes.NOT_FOUND);
    }

    const session = await SessionMessage.findOneAndUpdate(
      { user_id: user_id, topic_id: topicDoc._id },
      { $setOnInsert: { user_id: user_id, topic_id: topicDoc._id } },
      { upsert: true, new: true }
    );

    const messages = await ChatMessage.find({ session_id: session._id })
      .sort({ createdAt: 1 })
      .limit(20);

    const chatHistory = messages
      .map((msg) => {
        switch (msg.role) {
          case "user":
            return new HumanMessage({ content: msg.content });
          case "assistant":
            return new AIMessage({
              content: msg.content,
              tool_calls: msg.tool_calls || [],
            });
          case "tool":
            return new ToolMessage({
              content: msg.content as string,
              tool_call_id: msg.tool_call_id!,
            });
        }
      })
      .filter(Boolean);

    return { chatHistory, sessionId: session._id };
  }

  static async saveMessages(messages: IChatMessage[]) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await ChatMessage.insertMany(messages, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default ChatMessageRepository;
