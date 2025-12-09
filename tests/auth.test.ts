import request from "supertest"
import app from "../src/api/app"
import { StatusCodes } from "http-status-codes"
import prisma from "../src/lib/prisma"
import { logger } from "../src/utils/logging"

describe("POST /api/auth/register", () => {
    afterEach(async () => {
        await prisma.user.deleteMany({
            where: {
                username: "Test John Doe"
            }
        })
    })
    
    test("should can register new user", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test John Doe",
                email: "jEo3A@example.com",
                password: "123456"
            })

        expect(response.status).toBe(201)
    })

    test("should reject with status code 409 if user already exists", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test John Doe",
                email: "jEo3A@example.com",
                password: "123456"
            })

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test John Doe",
                email: "jEo3A@example.com",
                password: "123456"
            })

        expect(response.status).toBe(409)
    })

    test("should reject with status code 400 if email is invalid", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test John Doe",
                email: "",
                password: "123456"
            })
        
        expect(response.status).toBe(400)
    })
})

describe('POST /api/auth/login', () => {
    afterEach(async () => {
        await prisma.user.deleteMany({
            where: {
                username: "Test John Doe"
            }
        })
    })
    
    test('login successfull with status 200', async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test John Doe",
                email: "jEo3A@example.com",
                password: "123456"
            })

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'jEo3A@example.com',
                password: "123456"
            })
        expect(response.status).toBe(200)
        expect(response.body.data.token).toBeDefined()
    })

    test('login failed with status 404', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'failed@example.com',
                password: "failed123"
            })
        
        expect(response.status).toBe(404)
    })

    test('login failed with status 401', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: "Test John Doe",
                email: "jEo3A@example.com",
                password: "correct-password"
            })

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'jEo3A@example.com',
                password: 'wrong-password'
            })

        expect(response.status).toBe(401)
    })
})
