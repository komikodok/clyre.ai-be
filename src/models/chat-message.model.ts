import mongoose, { Schema, Document } from "mongoose";
import { IChatMessage } from "../types/message.type";

export interface IChatMessageDocument
  extends Omit<IChatMessage, "id">, Document {}

const chatMessageSchema = new Schema<IChatMessageDocument>(
  {
    session_message_id: {
      type: Schema.Types.ObjectId,
      ref: "SessionMessage",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    is_liked: {
      type: Boolean,
      required: false,
    },
    is_disliked: {
      type: Boolean,
      required: false,
    },
    tool_calls: {
      type: Schema.Types.Mixed,
      default: [],
      required: false,
    },
    tool_call_id: {
      type: String,
      default: null,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

chatMessageSchema.index({ session_message_id: 1, created_at: 1 });

const ChatMessage = mongoose.model<IChatMessageDocument>(
  "ChatMessage",
  chatMessageSchema,
  "chat_messages",
);

export default ChatMessage;
