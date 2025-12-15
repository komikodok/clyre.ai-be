import request from "supertest"
import app from "../src/api/app"
import prisma from "../src/lib/prisma"

describe("Auth API Integration Tests", () => {
    const TEST_USER = {
        username: "Test John Doe",
        email: "test@example.com",
        password: "password123"
    }

    const createTestUser = async () => {
        return await request(app)
            .post("/api/auth/register")
            .send(TEST_USER)
    }

    const cleanupTestUser = async () => {
        await prisma.user.deleteMany({
            where: {
                OR: [
                    { username: TEST_USER.username },
                    { email: TEST_USER.email }
                ]
            }
        })
    }

    describe("POST /api/auth/register", () => {
        beforeEach(async () => {
            await cleanupTestUser()
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should register new user and return 201", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send(TEST_USER)
                .expect(201)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 201)
            expect(response.body.meta).toHaveProperty('message', 'User registered successfully.')

            const user = await prisma.user.findUnique({
                where: { email: TEST_USER.email }
            })
            expect(user).not.toBeNull()
            expect(user?.username).toBe(TEST_USER.username)
            expect(user?.email).toBe(TEST_USER.email)
        })

        test("should return 409 when user already exists", async () => {
            await createTestUser()

            const response = await request(app)
                .post("/api/auth/register")
                .send(TEST_USER)
                .expect(409)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 409)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 400 when email is invalid", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: TEST_USER.username,
                    email: "invalid-email",
                    password: TEST_USER.password
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when email is empty", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: TEST_USER.username,
                    email: "",
                    password: TEST_USER.password
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when username is missing", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    email: TEST_USER.email,
                    password: TEST_USER.password
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when password is missing", async () => {
            const response = await request(app)
                .post("/api/auth/register")
                .send({
                    username: TEST_USER.username,
                    email: TEST_USER.email
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })
    })

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await cleanupTestUser()
            await createTestUser()
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should login successfully and return token", async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: TEST_USER.email,
                    password: TEST_USER.password
                })
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message', 'Login successful.')
            expect(response.body.data).toHaveProperty('token')
            expect(typeof response.body.data.token).toBe('string')
            expect(response.body.data.token.length).toBeGreaterThan(0)
        })

        test("should return 404 when user not found", async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'anypassword'
                })
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 401 when password is incorrect", async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: TEST_USER.email,
                    password: 'wrong-password'
                })
                .expect(401)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 401)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 400 when email is missing", async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    password: TEST_USER.password
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when password is missing", async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: TEST_USER.email
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })
    })
})
