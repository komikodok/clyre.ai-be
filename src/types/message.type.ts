import { Types } from "mongoose";

export type MessageRole = "user" | "assistant" | "tool";

export interface ISessionMessage {
  id?: string;
  user_id?: string | Types.ObjectId;
  topic_id?: string | Types.ObjectId;
  memory?: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface IChatMessage {
  id?: string;
  session_message_id: string | Types.ObjectId;
  role: MessageRole;
  content: string;
  is_liked?: boolean;
  is_disliked?: boolean;
  tool_calls?: any[];
  tool_call_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
