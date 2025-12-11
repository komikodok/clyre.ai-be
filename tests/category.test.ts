import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'
import { after } from 'node:test'


describe("GET /api/categories", () => {
    beforeAll(async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "test category"
            })

        expect(response.status).toBe(201)
    })

    afterAll(async () => {
        await prisma.category.deleteMany({
            where: { name: "test category" },
        });
    })

    test("should get all categories", async () => {
        const response = await request(app)
            .get("/api/categories")

        expect(response.status).toBe(200)
        expect(response.body.data.length).toBeGreaterThan(0)
    })

    test("should get categories by query search", async () => {
        const response = await request(app)
            .get("/api/categories?search=test category")

        expect(response.status).toBe(200)
        expect(response.body.data[0].name).toBe("test category")
    })
})

describe("POST /api/categories", () => {
    afterAll(async () => {
        await prisma.category.deleteMany({
            where: {
                name: "test category"
            }
        })
    })
    
    test("should create new category", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "test category"
            })

        expect(response.status).toBe(201)

        const category = await prisma.category.findFirst({
            where: { name: "test category" }
        })

        expect(category?.name).toBe("test category")
    })

    test("should reject with status code 409 if category is already exists", async () => {
        await request(app)
            .post("/api/categories")
            .send({
                name: "test category"
            })

        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "test category"
            })

        expect(response.status).toBe(409)
    })
})

describe("DELETE /api/categories/:id", () => {
    let id: string
    
    beforeAll(async () => {
            const response = await request(app)
                .post("/api/categories")
                .send({
                    name: "test category"
                })

            id = response.body.data.id

            expect(response.status).toBe(201)
        })

    afterAll(async () => {
        await prisma.category.deleteMany({ where: { id: id }})
    })

    test("should delete category", async () => {
        const response = await request(app)
            .delete(`/api/categories/${id}`)

        expect(response.status).toBe(200)
    })

    test("should reject with status code 404 if category not found", async () => {
        id = "wrong-id"
        
        const response = await request(app)
            .delete(`/api/categories/${id}`)

        expect(response.status).toBe(404)
    })
})