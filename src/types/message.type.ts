import { ToolCall } from "langchain";
import { Types } from "mongoose";

export type MessageRole = "user" | "assistant" | "tool";

export interface ISessionMessage {
  id?: string;
  user_id?: string | Types.ObjectId;
  title?: string;
  topic_id?: string | Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

export interface IChatMessage {
  id?: string;
  session_id: string | Types.ObjectId;
  role: MessageRole;
  content: string;
  is_liked?: boolean;
  is_disliked?: boolean;
  tool_calls?: ToolCall[];
  tool_call_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
