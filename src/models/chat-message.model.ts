import mongoose, { Schema, Document } from "mongoose";
import { IChatMessage } from "../types/message.type";

export interface IChatMessageDocument extends Omit<IChatMessage, "id">, Document { }

const chatMessageSchema = new Schema<IChatMessageDocument>(
    {
        session_id: {
            type: Schema.Types.ObjectId,
            ref: "SessionMessage",
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        is_liked: {
            type: Boolean,
            default: false,
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
    }
);

const ChatMessage = mongoose.model<IChatMessageDocument>("ChatMessage", chatMessageSchema, "chat_messages");

export default ChatMessage;
