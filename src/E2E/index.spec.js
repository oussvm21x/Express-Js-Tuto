import request from 'supertest';
import express from 'express';
import { createApp } from '../createApp.mjs';
import mongoose from "mongoose"





//testing api/auth/status

describe('get /api/auth/status', () => {
    let app
    beforeAll(async () => {

        await mongoose
            .connect("mongodb://localhost:27017/express_test")
            .then(() => console.log("Connected to test database"))
            .catch((err) => console.error("test Database connection error:", err));
        app = createApp()
    })


    it("should return 401 when user not authenticated", async () => {
        const response = await request(app).get('/api/auth/status')
        expect(response.status).toBe(401)
    })


    afterAll(async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})