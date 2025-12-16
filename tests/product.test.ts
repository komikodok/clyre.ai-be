import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'
import { slugify } from '../src/utils/slugify'

describe("Product API Integration Tests", () => {
    const TEST_PRODUCTS = {
        GET: "Test Laptop",
        POST: "Test Smartphone",
        UPDATE: "Test Tablet",
        DELETE: "Test Headphones"
    }

    let testCategoryId: string

    // Create a test category for all product tests
    beforeAll(async () => {
        const category = await prisma.category.create({
            data: { name: "test-electronics" }
        })
        testCategoryId = category.id
    })

    // Clean up test category after all tests
    afterAll(async () => {
        await prisma.category.deleteMany({
            where: { name: "test-electronics" }
        })
    })

    const createTestProduct = async (
        name: string,
        priceAmount: number = 1000000,
        priceCurrency: 'IDR' | 'USD' = 'IDR',
        stock: number = 10

    ) => {
        return await prisma.product.create({
            data: {
                name,
                slug: slugify(name),
                priceAmount,
                priceCurrency: priceCurrency,
                stock: stock,
                categoryId: testCategoryId
            }
        })
    }

    const cleanupProducts = async (names: string[]) => {
        await prisma.product.deleteMany({
            where: {
                name: { in: names }
            }
        })
    }

    describe("GET /api/products", () => {
        beforeEach(async () => {
            await createTestProduct(TEST_PRODUCTS.GET)
        })

        afterEach(async () => {
            await cleanupProducts([TEST_PRODUCTS.GET])
        })

        test("should return 200 and all products with pagination", async () => {
            const response = await request(app)
                .get("/api/products")
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')
            expect(response.body).toHaveProperty('data')
            expect(Array.isArray(response.body.data)).toBe(true)
            expect(response.body.data.length).toBeGreaterThanOrEqual(1)

            // Check pagination metadata
            expect(response.body).toHaveProperty('totalItems')
            expect(response.body).toHaveProperty('totalPages')
            expect(response.body).toHaveProperty('limit')
        })

        test("should return products with correct structure", async () => {
            const response = await request(app)
                .get("/api/products")
                .expect(200)

            const product = response.body.data[0]
            expect(product).toHaveProperty('id')
            expect(product).toHaveProperty('name')
            expect(product).toHaveProperty('slug')
            expect(product).toHaveProperty('priceAmount')
            expect(product).toHaveProperty('priceCurrency')
            expect(product).toHaveProperty('stock')
            expect(product).toHaveProperty('categoryId')
            expect(product).toHaveProperty('category')
            expect(product).toHaveProperty('images')
            expect(product).toHaveProperty('variants')
            expect(product).toHaveProperty('createdAt')
            expect(product).toHaveProperty('updatedAt')
        })

        test("should filter products by search query (name)", async () => {
            const response = await request(app)
                .get(`/api/products?search=${TEST_PRODUCTS.GET}`)
                .expect(200)

            expect(response.body.data.length).toBeGreaterThanOrEqual(1)
            expect(response.body.data[0].name).toContain(TEST_PRODUCTS.GET)
        })

        test("should return empty array when search has no matches", async () => {
            const response = await request(app)
                .get("/api/products?search=nonexistent-product-xyz-123")
                .expect(200)

            expect(response.body.data).toHaveLength(0)
        })

        test("should support pagination with page and limit", async () => {
            const response = await request(app)
                .get("/api/products?page=1&limit=5")
                .expect(200)

            expect(response.body.limit).toBe(5)
            expect(response.body.data.length).toBeLessThanOrEqual(5)
        })

        test("should support sorting (asc/desc)", async () => {
            const responseAsc = await request(app)
                .get("/api/products?sort=asc")
                .expect(200)

            const responseDesc = await request(app)
                .get("/api/products?sort=desc")
                .expect(200)

            expect(responseAsc.body.data).toBeDefined()
            expect(responseDesc.body.data).toBeDefined()
        })
    })

    describe("GET /api/products/:id", () => {
        let productId: string

        beforeEach(async () => {
            const product = await createTestProduct(TEST_PRODUCTS.GET)
            productId = product.id
        })

        afterEach(async () => {
            await cleanupProducts([TEST_PRODUCTS.GET])
        })

        test("should return 200 and product by id", async () => {
            const response = await request(app)
                .get(`/api/products/${productId}`)
                .expect(200)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.data).toHaveProperty('id', productId)
            expect(response.body.data).toHaveProperty('name', TEST_PRODUCTS.GET)
            expect(response.body.data).toHaveProperty('category')
            expect(response.body.data).toHaveProperty('images')
            expect(response.body.data).toHaveProperty('variants')
        })

        test("should return 404 when product not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .get(`/api/products/${fakeId}`)
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta).toHaveProperty('message')
        })
    })

    describe("POST /api/products", () => {
        afterEach(async () => {
            await cleanupProducts([TEST_PRODUCTS.POST, "Test Product Auto Slug"])
        })

        test("should create new product and return 201", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    priceAmount: 5000000,
                    priceCurrency: 'IDR',
                    stock: 20,
                    categoryId: testCategoryId
                })
                .expect(201)
                .expect('Content-Type', /json/)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 201)
            expect(response.body.data).toHaveProperty('id')
            expect(response.body.data.name).toBe(TEST_PRODUCTS.POST)
            expect(response.body.data.priceAmount).toBe(5000000)
            expect(response.body.data.stock).toBe(20)

            // Verify in database
            const product = await prisma.product.findFirst({
                where: { name: TEST_PRODUCTS.POST }
            })
            expect(product).not.toBeNull()
            expect(product?.name).toBe(TEST_PRODUCTS.POST)
        })

        test("should auto-generate slug from name when slug not provided", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    name: "Test Product Auto Slug",
                    priceAmount: 1000000,
                    categoryId: testCategoryId
                })
                .expect(201)

            expect(response.body.data.slug).toBe("test-product-auto-slug")
        })

        test("should accept custom slug", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    slug: "custom-slug-test",
                    priceAmount: 1000000,
                    categoryId: testCategoryId
                })
                .expect(201)

            expect(response.body.data.slug).toBe("custom-slug-test")

            await cleanupProducts(["custom-slug-test"])
        })

        test("should return 409 when slug already exists", async () => {
            await createTestProduct(TEST_PRODUCTS.POST)

            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    priceAmount: 1000000,
                    categoryId: testCategoryId
                })
                .expect(409)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 409)
            expect(response.body.meta.message).toContain('slug')
        })

        test("should return 404 when category not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    priceAmount: 1000000,
                    categoryId: fakeId
                })
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta.message).toContain('Category')
        })

        test("should return 400 when required fields are missing", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({})
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should return 400 when priceAmount is invalid", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    priceAmount: -1000,
                    categoryId: testCategoryId
                })
                .expect(400)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 400)
        })

        test("should create product with optional fields", async () => {
            const response = await request(app)
                .post("/api/products")
                .send({
                    name: TEST_PRODUCTS.POST,
                    sku: "SKU-TEST-001",
                    description: "This is a test product description",
                    priceAmount: 2000000,
                    priceCurrency: 'USD',
                    stock: 50,
                    categoryId: testCategoryId
                })
                .expect(201)

            expect(response.body.data.sku).toBe("SKU-TEST-001")
            expect(response.body.data.description).toBe("This is a test product description")
            expect(response.body.data.priceCurrency).toBe("USD")
        })
    })

    describe("PATCH /api/products/:id", () => {
        let productId: string

        beforeEach(async () => {
            const product = await createTestProduct(TEST_PRODUCTS.UPDATE, 3000000)
            productId = product.id
        })

        afterEach(async () => {
            await cleanupProducts([TEST_PRODUCTS.UPDATE, "Updated Product Name"])
        })

        test("should update product and return 200", async () => {
            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    name: "Updated Product Name",
                    priceAmount: 4000000,
                    stock: 30
                })
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.data.name).toBe("Updated Product Name")
            expect(response.body.data.priceAmount).toBe(4000000)
            expect(response.body.data.stock).toBe(30)

            // Verify in database
            const product = await prisma.product.findUnique({
                where: { id: productId }
            })
            expect(product?.name).toBe("Updated Product Name")
        })

        test("should auto-generate slug when updating name without slug", async () => {
            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    name: "Updated Product Name"
                })
                .expect(200)

            expect(response.body.data.slug).toBe("updated-product-name")
        })

        test("should update with custom slug", async () => {
            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    slug: "custom-updated-slug"
                })
                .expect(200)

            expect(response.body.data.slug).toBe("custom-updated-slug")
        })

        test("should return 409 when updating to existing slug", async () => {
            const anotherProduct = await createTestProduct("Another Product")

            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    slug: anotherProduct.slug
                })
                .expect(409)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 409)
            expect(response.body.meta.message).toContain('slug')

            await cleanupProducts(["Another Product"])
        })

        test("should return 404 when product not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .patch(`/api/products/${fakeId}`)
                .send({
                    name: "Updated Name"
                })
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta.message).toContain('Product')
        })

        test("should return 404 when updating with non-existent category", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    categoryId: fakeId
                })
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta.message).toContain('Category')
        })

        test("should update only specified fields", async () => {
            const response = await request(app)
                .patch(`/api/products/${productId}`)
                .send({
                    stock: 100
                })
                .expect(200)

            expect(response.body.data.stock).toBe(100)
            expect(response.body.data.name).toBe(TEST_PRODUCTS.UPDATE)
        })
    })

    describe("DELETE /api/products/:id", () => {
        let productId: string

        beforeEach(async () => {
            const product = await createTestProduct(TEST_PRODUCTS.DELETE)
            productId = product.id
        })

        afterEach(async () => {
            await cleanupProducts([TEST_PRODUCTS.DELETE])
        })

        test("should delete product and return 200", async () => {
            const response = await request(app)
                .delete(`/api/products/${productId}`)
                .expect(200)

            expect(response.body.meta).toHaveProperty('status', 'success')
            expect(response.body.meta).toHaveProperty('code', 200)
            expect(response.body.meta).toHaveProperty('message')

            // Verify deletion in database
            const product = await prisma.product.findUnique({
                where: { id: productId }
            })
            expect(product).toBeNull()
        })

        test("should return 404 when product not found", async () => {
            const fakeId = "00000000-0000-0000-0000-000000000000"

            const response = await request(app)
                .delete(`/api/products/${fakeId}`)
                .expect(404)

            expect(response.body.meta).toHaveProperty('status', 'error')
            expect(response.body.meta).toHaveProperty('code', 404)
            expect(response.body.meta.message).toContain('Product')
        })
    })
})