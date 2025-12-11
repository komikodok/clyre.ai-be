import { loginSchema, registerSchema } from "../validation/auth.schema";
import validate from "../validation/validation";
import ResponseError from "../utils/error";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs"
import { StatusCodes } from "http-status-codes";
import { Login, Register } from "../types/auth.type";
import jwt from "../utils/jwt";

const authService = {
    register: async (data: Register) => {
        const userDataValidate = validate(registerSchema, data)
    
        const countUser = await prisma.user.count({
            where: { email: userDataValidate.email }
        })
    
        if (countUser === 1) {
            throw new ResponseError("User already exists", StatusCodes.CONFLICT)
        }
        
        const hashedPassword = await bcrypt.hash(userDataValidate.password, 10)
    
        await prisma.user.create({
            data: {
                ...userDataValidate,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        })
    
        return null
    },
    
    login: async (data: Login) => {
        const loginDataValidate = validate(loginSchema, data)
    
        const user = await prisma.user.findUnique({
            where: { email: loginDataValidate.email }
        })
        if (!user) {
            throw new ResponseError("User not found", 404)
        }
    
        const isValidPassword = await bcrypt.compare(loginDataValidate.password, user.password)
        if (!isValidPassword) {
            throw new ResponseError("Invalid email or password", 401)
        }
    
        const token = jwt.sign({ id: user.id, username: user.username })
    
        return token
    }
}

export default authService