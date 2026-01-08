import mongoose, { Schema, Document } from "mongoose";
import { ITopic } from "../types/topic.type";

export interface ITopicDocument extends Omit<ITopic, "id">, Document {}

const topicSchema = new Schema<ITopicDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
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

const Topic = mongoose.model<ITopicDocument>("Topic", topicSchema, "topics");

export default Topic;
