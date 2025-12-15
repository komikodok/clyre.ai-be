import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'
import { after } from 'node:test'


describe("GET /api/categories", () => {
    beforeEach(async () => {
        await prisma.category.create({
            data: {
                name: "get-test category"
            }
        })
    })

    afterEach(async () => {
        await prisma.category.deleteMany({
            where: { name: "get-test category" },
        });
    })

    test("should get all categories", async () => {
        const response = await request(app)
            .get("/api/categories")

        expect(response.status).toBe(200)
        expect(response.body.data).toHaveLength(1)
    })

    test("should get categories by query search", async () => {
        const response = await request(app)
            .get("/api/categories?search=get-test category")

        expect(response.status).toBe(200)
        expect(response.body.data[0]).toHaveProperty("name")
    })
})

describe("POST /api/categories", () => {
    afterEach(async () => {
        await prisma.category.deleteMany({
            where: {
                name: "post-test category"
            }
        })
    })
    
    test("should create new category", async () => {
        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "post-test category"
            })

        expect(response.status).toBe(201)

        const category = await prisma.category.findFirst({
            where: { name: "post-test category" }
        })

        expect(category?.name).toBe("post-test category")
    })

    test("should reject with status code 409 if category is already exists", async () => {
        await request(app)
            .post("/api/categories")
            .send({
                name: "post-test category"
            })

        const response = await request(app)
            .post("/api/categories")
            .send({
                name: "post-test category"
            })

        expect(response.status).toBe(409)
    })
})

describe("DELETE /api/categories/:id", () => {
    let id: string
    
    beforeEach(async () => {
        const category = await prisma.category.create({
            data: {
                name: 'delete-test category'
            }
        })

        id = category.id    
    })

    afterEach(async () => {
        await prisma.category.deleteMany({ where: { name: "delete-test category" } })
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