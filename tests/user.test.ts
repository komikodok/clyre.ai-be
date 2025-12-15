import request from "supertest"
import app from "../src/api/app"
import prisma from "../src/lib/prisma"

describe("User API Integration Tests", () => {
    const TEST_USER = {
        username: "Test User",
        email: "testuser@example.com",
        password: "password123"
    }

    let authToken: string

    const registerAndLoginUser = async () => {
        await request(app)
            .post("/api/auth/register")
            .send(TEST_USER)

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: TEST_USER.email,
                password: TEST_USER.password
            })

        return loginResponse.body.data.token
    }

    const cleanupTestUser = async () => {
        await prisma.user.deleteMany({
            where: {
                OR: [
                    { email: TEST_USER.email },
                    { username: TEST_USER.username }
                ]
            }
        })
    }

    describe("GET /api/users", () => {
        beforeEach(async () => {
            await cleanupTestUser()
            await request(app)
                .post("/api/auth/register")
                .send(TEST_USER)
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should return all users with correct structure", async () => {
            const response = await request(app)
                .get("/api/users")
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message', 'Users fetched successfully.')
            expect(Array.isArray(response.body.data)).toBe(true)
            expect(response.body.data.length).toBeGreaterThan(0)
        })

        test("should not include password in response", async () => {
            const response = await request(app)
                .get("/api/users")
                .expect(200)

            const user = response.body.data[0]
            expect(user).toHaveProperty('id')
            expect(user).toHaveProperty('username')
            expect(user).toHaveProperty('email')
            expect(user).not.toHaveProperty('password')
        })

        test("should return user with correct fields", async () => {
            const response = await request(app)
                .get("/api/users")
                .expect(200)

            const user = response.body.data[0]
            expect(user).toHaveProperty('id')
            expect(user).toHaveProperty('username')
            expect(user).toHaveProperty('email')
            expect(user).toHaveProperty('image')
        })
    })

    describe("GET /api/users/profile", () => {
        beforeEach(async () => {
            await cleanupTestUser()
            authToken = await registerAndLoginUser()
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should get user profile with valid token", async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message', 'User fetched successfully.')
            expect(response.body.data).toHaveProperty('id')
            expect(response.body.data).toHaveProperty('username', TEST_USER.username)
            expect(response.body.data).toHaveProperty('email', TEST_USER.email)
            expect(response.body.data).not.toHaveProperty('password')
        })

        test("should return 401 when authorization token is missing", async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .expect(401)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 401)
        })

        test("should return 401 when token is invalid", async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 401)
        })

        test("should return 401 when authorization header format is wrong", async () => {
            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', authToken)
                .expect(401)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 401)
        })
    })

    describe("GET /api/users/:id", () => {
        let userId: string

        beforeEach(async () => {
            await cleanupTestUser()
            await request(app)
                .post("/api/auth/register")
                .send(TEST_USER)

            const user = await prisma.user.findUnique({
                where: { email: TEST_USER.email }
            })
            userId = user!.id

            authToken = await registerAndLoginUser()
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should get user by id", async () => {
            const response = await request(app)
                .get(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.data).toHaveProperty('id', userId)
            expect(response.body.data).toHaveProperty('username', TEST_USER.username)
            expect(response.body.data).not.toHaveProperty('password')
        })

        test("should return 404 when user not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .get(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
        })
    })

    describe("PUT /api/users/:id", () => {
        let userId: string

        beforeEach(async () => {
            await cleanupTestUser()
            await request(app)
                .post("/api/auth/register")
                .send(TEST_USER)

            const user = await prisma.user.findUnique({
                where: { email: TEST_USER.email }
            })
            userId = user!.id

            authToken = await registerAndLoginUser()
        })

        afterEach(async () => {
            await cleanupTestUser()
        })

        test("should update user successfully", async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    username: "Updated Username"
                })
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.data).toHaveProperty('username', 'Updated Username')
            expect(response.body.data).not.toHaveProperty('password')

            const user = await prisma.user.findUnique({
                where: { id: userId }
            })
            expect(user?.username).toBe('Updated Username')
        })

        test("should update password and hash it", async () => {
            const response = await request(app)
                .put(`/api/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    password: "newpassword123"
                })
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')

            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: TEST_USER.email,
                    password: "newpassword123"
                })
                .expect(200)

            expect(loginResponse.body.data).toHaveProperty('token')
        })

        test("should return 404 when user not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .put(`/api/users/${fakeId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    username: "New Name"
                })
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
        })
    })
}) 
