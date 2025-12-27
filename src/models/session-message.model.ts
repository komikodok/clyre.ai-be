import mongoose, { Schema, Document } from "mongoose";
import { ISessionMessage } from "../types/message.type";

export interface ISessionMessageDocument extends Omit<ISessionMessage, "id">, Document { }

const sessionMessageSchema = new Schema<ISessionMessageDocument>(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            default: "",
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

const SessionMessage = mongoose.model<ISessionMessageDocument>("SessionMessage", sessionMessageSchema, "session_messages");

export default SessionMessage;
