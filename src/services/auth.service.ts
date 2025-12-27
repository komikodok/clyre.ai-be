import { loginSchema, registerSchema } from "../validation/auth.schema";
import validate from "../validation/validation";
import ResponseError from "../utils/error";
import User from "../models/user.model";
import bcrypt from "bcryptjs"
import { StatusCodes } from "http-status-codes";
import { Login, Register } from "../types/auth.type";
import jwt from "../utils/jwt";

const authService = {
    register: async (data: Register) => {
        const userDataValidate = validate(registerSchema, data)

        const existingUser = await User.findOne({ email: userDataValidate.email })

        if (existingUser) {
            throw new ResponseError("User already exists", StatusCodes.CONFLICT)
        }

        const { confirm_password, ...userToSave } = userDataValidate;
        const hashedPassword = await bcrypt.hash(userToSave.password, 10)

        await User.create({
            ...userToSave,
            password: hashedPassword
        })

        return { data: null }
    },

    login: async (data: Login) => {
        const loginDataValidate = validate(loginSchema, data)

        const user = await User
            .findOne({ email: loginDataValidate.email })
            .select("+password")
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        const isValidPassword = await bcrypt.compare(loginDataValidate.password, user.password as string)
        if (!isValidPassword) {
            throw new ResponseError("Invalid email or password", 401)
        }

        const token = jwt.sign({ id: (user as any).id, username: user.username })

        return { data: { token } }
    }
}

export default authService