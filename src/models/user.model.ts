import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user.type";

export interface IUserDocument extends Omit<IUser, "id" | "confirm_password">, Document { }

const userSchema = new Schema<IUserDocument>(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        image: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        toJSON: {
            transform: (doc, ret: any) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.password;
                return ret;
            },
        },
    }
);

const User = mongoose.model<IUserDocument>("User", userSchema, "users");

export default User;
