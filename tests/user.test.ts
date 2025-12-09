import request from "supertest"
import app from "../src/api/app"
import prisma from "../src/lib/prisma";
import { logger } from "../src/utils/logging";

describe("GET /api/users", () => {
    beforeAll(async () => {
        await prisma.user.create({
        data: {
            username: "Test User",
            email: "testuser@example.com",
            password: "hashedpassword",
        },
        })
    })

    afterAll(async () => {
        await prisma.user.deleteMany({
        where: { email: "testuser@example.com" },
        });
        await prisma.$disconnect();
    })

    test("should get all users return [] if no user", async () => {
        const response = await request(app)
            .get("/api/users")

        expect(response.status).toBe(200)
        expect(response.body.data[0].username).toBe("Test User")
        expect(response.body.data[0].email).toBe("testuser@example.com")
        expect(response.body.data[0].password).toBeUndefined()
    })
})

describe('GET /api/users/profile', () => {
    beforeAll(async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                username: "Test User",
                email: "testuser@example.com",
                password: "hashedpassword",
            })
    })

    afterAll(async () => {
        await prisma.user.deleteMany({
            where: { email: "testuser@example.com" },
        });
        await prisma.$disconnect();
    })

    test('should get user profile', async () => {
        const login = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'hashedpassword'
            })

        const token = login.body.data.token

        const response = await request(app)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
    })

    test('should reject when authorization token is missing', async () => {
        const response = await request(app)
            .get('/api/users/profile')

        expect(response.status).toBe(401)
    })
}) 
