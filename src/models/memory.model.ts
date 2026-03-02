import mongoose, { Schema, Document } from "mongoose";

export interface IMemory {
  id?: string;
  user_id: string | mongoose.Types.ObjectId;
  content: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface IMemoryDocument extends Omit<IMemory, "id">, Document {}

const memorySchema = new Schema<IMemoryDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: [String],
      required: true,
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

memorySchema.index({ user_id: 1 });

const Memory = mongoose.model<IMemoryDocument>(
  "Memory",
  memorySchema,
  "memories",
);

export default Memory;
