import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'

describe("Category API Integration Tests", () => {
    const TEST_CATEGORIES = {
        GET: "electronics",
        POST: "fashion",
        DELETE: "books"
    }

    const createTestCategory = async (name: string) => {
        return await prisma.category.create({
            data: { name }
        })
    }

    const cleanupCategories = async (names: string[]) => {
        await prisma.category.deleteMany({
            where: {
                name: { in: names }
            }
        })
    }

    describe("GET /api/categories", () => {
        beforeEach(async () => {
            await createTestCategory(TEST_CATEGORIES.GET)
        })

        afterEach(async () => {
            await cleanupCategories([TEST_CATEGORIES.GET])
        })

        test("should return 200 and all categories", async () => {
            const response = await request(app)
                .get("/api/categories")
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')
            expect(response.body).toHaveProperty('data')
            expect(Array.isArray(response.body.data)).toBe(true)
            expect(response.body.data.length).toBeGreaterThanOrEqual(1)
        })

        test("should return categories with correct structure", async () => {
            const response = await request(app)
                .get("/api/categories")
                .expect(200)

            const category = response.body.data[0]
            expect(category).toHaveProperty('id')
            expect(category).toHaveProperty('name')
            expect(category).toHaveProperty('createdAt')
            expect(category).toHaveProperty('updatedAt')
        })

        test("should filter categories by search query", async () => {
            const response = await request(app)
                .get(`/api/categories?search=${TEST_CATEGORIES.GET}`)
                .expect(200)

            expect(response.body.data.length).toBeGreaterThanOrEqual(1)
            expect(response.body.data[0].name).toContain(TEST_CATEGORIES.GET)
        })

        test("should return empty array when search has no matches", async () => {
            const response = await request(app)
                .get("/api/categories?search=nonexistent-category-xyz")
                .expect(200)

            expect(response.body.data).toHaveLength(0)
        })
    })

    describe("POST /api/categories", () => {
        afterEach(async () => {
            await cleanupCategories([TEST_CATEGORIES.POST])
        })

        test("should create new category and return 201", async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({ name: TEST_CATEGORIES.POST })
                .expect(201)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 201)
            expect(response.body.meta).toHaveProperty('message')
            expect(response.body.data).toHaveProperty('id')
            expect(response.body.data.name).toBe(TEST_CATEGORIES.POST)

            const category = await prisma.category.findFirst({
                where: { name: TEST_CATEGORIES.POST }
            })
            expect(category).not.toBeNull()
            expect(category?.name).toBe(TEST_CATEGORIES.POST)
        })

        test("should convert category name to lowercase", async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({ name: "UPPERCASE" })
                .expect(201)

            expect(response.body.data.name).toBe("uppercase")

            await cleanupCategories(["uppercase"])
        })

        test("should return 409 when category already exists", async () => {
            await request(app)
                .post("/api/categories")
                .send({ name: TEST_CATEGORIES.POST })
                .expect(201)

            const response = await request(app)
                .post("/api/categories")
                .send({ name: TEST_CATEGORIES.POST })
                .expect(409)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 409)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 400 when name is missing", async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({})
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 400 when name is too short", async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({ name: "ab" })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 400 when name is too long", async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({ name: "a".repeat(51) })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
            expect(response.body.meta).toHaveProperty('message')
        })
    })

    describe("DELETE /api/categories/:id", () => {
        let categoryId: string

        beforeEach(async () => {
            const category = await createTestCategory(TEST_CATEGORIES.DELETE)
            categoryId = category.id
        })

        afterEach(async () => {
            await cleanupCategories([TEST_CATEGORIES.DELETE])
        })

        test("should delete category and return 200", async () => {
            const response = await request(app)
                .delete(`/api/categories/${categoryId}`)
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')

            const category = await prisma.category.findUnique({
                where: { id: categoryId }
            })
            expect(category).toBeNull()
        })

        test("should return 404 when category not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .delete(`/api/categories/${fakeId}`)
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta).toHaveProperty('message')
        })

        test("should return 404 when id format is invalid", async () => {
            const response = await request(app)
                .delete("/api/categories/invalid-id-format")
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta).toHaveProperty('message')
        })
    })
})