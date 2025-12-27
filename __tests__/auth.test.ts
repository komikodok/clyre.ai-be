import request from "supertest"
import mongoose from "mongoose"
import app from "../src/api/app"



describe("Auth API Integration Tests", () => {
    const USER_TEST = {
        username: "john.doe",
        email: "john.doe@example.com",
        password: "password",
        confirm_password: "password"
    }

    describe("POST /api/auth/register", () => {
        afterEach(async () => {
            await mongoose.connection?.db?.dropDatabase()
        })

        it("should register a new user", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send(USER_TEST)
            expect(response.statusCode).toBe(201)
        })
    })
})