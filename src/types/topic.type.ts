import { Types } from "mongoose";

export interface ITopic {
  id?: string;
  name: string;
  icon?: string;
  created_at?: Date;
  updated_at?: Date;
}
