import { Types } from "mongoose";

export type MessageRole = "user" | "assistant" | "system";

export interface ISessionMessage {
    id?: string;
    user_id?: string | Types.ObjectId;
    title?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface IChatMessage {
    id?: string;
    session_id: string | Types.ObjectId;
    role: MessageRole;
    content: string;
    is_liked?: boolean;
    created_at?: Date;
    updated_at?: Date;
}
