import bcrypt from "bcryptjs"
import User from "../models/user.model";
import { IUser } from "../types/user.type"
import ResponseError from "../utils/error"
import { updateUserSchema } from "../validation/user.schema"
import validate from "../validation/validation"

const userService = {
    getAll: async () => {
        const users = await User.find({}, "email username image")
        return { data: users }
    },
    getById: async (id: string) => {
        const user = await User.findById(id, "email username image")
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        return { data: user }
    },
    update: async (id: string, data: IUser) => {
        const userDataValidate = validate(updateUserSchema, data)

        const user = await User.findById(id)
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        const { password, confirm_password, ...updateData } = userDataValidate;
        const updateFields: any = { ...updateData };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, select: "email username image" }
        )

        return { data: updateUser }
    },
    delete: async (id: string) => {
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        return { data: null }
    }
}

export default userService