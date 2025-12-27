import mongoose from "mongoose"
import { connectDB } from "./src/config/database"
import dotenv from "dotenv"


dotenv.config({ path: ".env.test" })
process.env.NODE_ENV = "test"


beforeAll(async () => {
    await connectDB()
})

afterAll(async () => {
    await mongoose.connection?.db?.dropDatabase()
    await mongoose.disconnect()
})