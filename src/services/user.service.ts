import bcrypt from "bcryptjs"
import prisma from "../lib/prisma"
import { IUser } from "../types/user.type"
import ResponseError from "../utils/error"
import { userSchema } from "../validation/user.schema"
import validate from "../validation/validation"

const userService = {
    getAll: async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                image: true
            }
        })
        return { data: users }
    },
    getById: async (id: string) => {
        const user = await prisma.user.findUnique({ 
            where: { id }, 
            select: {
                id: true,
                email: true,
                username: true,
                image: true
            }
        })
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        return { data: user }
    },
    update: async (id: string, data: IUser) => {
        const userDataValidate = validate(userSchema, data)        

        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) {
            throw new ResponseError("User not found", 404)
        }

        let password = user.password
        if (userDataValidate.password) {
            password = await bcrypt.hash(userDataValidate.password, 10)
        }

        const updateUser = await prisma.user.update({
            where: { id },
            data: {
                ...userDataValidate,
                password
            },
            select: {
                id: true,
                email: true,
                username: true,
                image: true
            }  
        })

        return { data: updateUser }
    }
}

export default userService