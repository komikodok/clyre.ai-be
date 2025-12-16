import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'

describe("Variant API Integration Tests", () => {
    const TEST_VARIANTS = {
        GET: "Large",
        POST: "Medium",
        DELETE: "Small"
    }

    let testProductId: string

    // Create a test product and category for all variant tests
    beforeAll(async () => {
        const category = await prisma.category.create({
            data: { name: "test-variant-category" }
        })

        const product = await prisma.product.create({
            data: {
                name: "Test Variant Product",
                slug: "test-variant-product",
                priceAmount: 1000000,
                priceCurrency: 'IDR',
                stock: 10,
                categoryId: category.id
            }
        })
        testProductId = product.id
    })

    // Clean up test data after all tests
    afterAll(async () => {
        await prisma.product.deleteMany({
            where: { name: "Test Variant Product" }
        })
        await prisma.category.deleteMany({
            where: { name: "test-variant-category" }
        })
    })

    const createTestVariant = async (name: string, stock: number = 10) => {
        return await prisma.productVariant.create({
            data: {
                name: name.toLowerCase(),
                stock,
                productId: testProductId
            }
        })
    }

    const cleanupVariants = async (names: string[]) => {
        await prisma.productVariant.deleteMany({
            where: {
                name: { in: names.map(n => n.toLowerCase()) }
            }
        })
    }

    describe("GET /api/variants", () => {
        beforeEach(async () => {
            await createTestVariant(TEST_VARIANTS.GET)
        })

        afterEach(async () => {
            await cleanupVariants([TEST_VARIANTS.GET])
        })

        test("should return 200 and all variants", async () => {
            const response = await request(app)
                .get("/api/variants")
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')
            expect(response.body).toHaveProperty('data')
            expect(Array.isArray(response.body.data)).toBe(true)
            expect(response.body.data.length).toBeGreaterThanOrEqual(1)
        })

        test("should return variants with correct structure", async () => {
            const response = await request(app)
                .get("/api/variants")
                .expect(200)

            const variant = response.body.data[0]
            expect(variant).toHaveProperty('id')
            expect(variant).toHaveProperty('name')
            expect(variant).toHaveProperty('stock')
            expect(variant).toHaveProperty('productId')
            expect(variant).toHaveProperty('createdAt')
            expect(variant).toHaveProperty('updatedAt')
        })

        test("should filter variants by search query", async () => {
            const response = await request(app)
                .get(`/api/variants?search=${TEST_VARIANTS.GET.toLowerCase()}`)
                .expect(200)

            expect(response.body.data.length).toBeGreaterThanOrEqual(1)
            expect(response.body.data[0].name).toContain(TEST_VARIANTS.GET.toLowerCase())
        })

        test("should return empty array when search has no matches", async () => {
            const response = await request(app)
                .get("/api/variants?search=nonexistent-variant-xyz-123")
                .expect(200)

            expect(response.body.data).toHaveLength(0)
        })
    })

    describe("POST /api/variants", () => {
        afterEach(async () => {
            await cleanupVariants([TEST_VARIANTS.POST, "UPPERCASE"])
        })

        test("should create new variant and return 201", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: TEST_VARIANTS.POST,
                    stock: 20,
                    productId: testProductId
                })
                .expect(201)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 201)
            expect(response.body.data).toHaveProperty('id')
            expect(response.body.data.name).toBe(TEST_VARIANTS.POST.toLowerCase())
            expect(response.body.data.stock).toBe(20)
            expect(response.body.data.productId).toBe(testProductId)

            // Verify in database
            const variant = await prisma.productVariant.findFirst({
                where: { name: TEST_VARIANTS.POST.toLowerCase() }
            })
            expect(variant).not.toBeNull()
            expect(variant?.name).toBe(TEST_VARIANTS.POST.toLowerCase())
        })

        test("should convert variant name to lowercase", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: "UPPERCASE",
                    stock: 15,
                    productId: testProductId
                })
                .expect(201)

            expect(response.body.data.name).toBe("uppercase")
        })

        test("should return 409 when variant already exists", async () => {
            await createTestVariant(TEST_VARIANTS.POST)

            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: TEST_VARIANTS.POST,
                    stock: 10,
                    productId: testProductId
                })
                .expect(409)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 409)
            expect(response.body.meta.message).toContain('already exists')
        })

        test("should return 400 when required fields are missing", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({})
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when name is too short", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: "ab",
                    stock: 10,
                    productId: testProductId
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when name is too long", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: "a".repeat(51),
                    stock: 10,
                    productId: testProductId
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when stock is negative", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: TEST_VARIANTS.POST,
                    stock: -5,
                    productId: testProductId
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should accept stock value of 0", async () => {
            const response = await request(app)
                .post("/api/variants")
                .send({
                    name: TEST_VARIANTS.POST,
                    stock: 0,
                    productId: testProductId
                })
                .expect(201)

            expect(response.body.data.stock).toBe(0)
        })
    })

    describe("DELETE /api/variants/:id", () => {
        let variantId: string

        beforeEach(async () => {
            const variant = await createTestVariant(TEST_VARIANTS.DELETE)
            variantId = variant.id
        })

        afterEach(async () => {
            await cleanupVariants([TEST_VARIANTS.DELETE])
        })

        test("should delete variant and return 200", async () => {
            const response = await request(app)
                .delete(`/api/variants/${variantId}`)
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')

            // Verify deletion in database
            const variant = await prisma.productVariant.findUnique({
                where: { id: variantId }
            })
            expect(variant).toBeNull()
        })

        test("should return 404 when variant not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .delete(`/api/variants/${fakeId}`)
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta.message).toContain('not found')
        })
    })
})
