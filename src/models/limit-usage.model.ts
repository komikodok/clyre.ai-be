import mongoose, { Schema, Document } from "mongoose";

export interface ILimitUsage {
  id?: string;
  user_id: mongoose.Types.ObjectId;
  usage: number;
  is_exceeded: boolean;
}

export interface ILimitUsageDocument
  extends Omit<ILimitUsage, "id">, Document {}

const limitUsageSchema = new Schema<ILimitUsageDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    usage: {
      type: Number,
      required: true,
      max: 40,
      min: 0,
    },
    is_exceeded: {
      type: Boolean,
      required: true,
      default: false,
      index: true,
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

limitUsageSchema.index({ user_id: 1, created_at: 1 });

const LimitUsage = mongoose.model<ILimitUsageDocument>(
  "LimitUsage",
  limitUsageSchema,
  "limit_usages",
);

export default LimitUsage;
