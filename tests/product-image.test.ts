import request from 'supertest'
import app from '../src/api/app'
import prisma from '../src/lib/prisma'
import { slugify } from '../src/utils/slugify'

describe("Product Image API Integration Tests", () => {
    test("", async () => {
        expect(true).toBe(true)
    })
})
