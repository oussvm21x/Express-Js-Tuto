import request from 'supertest';
import express from 'express';
import { createApp } from '../createApp.mjs';
import mongoose from "mongoose"





//testing api/auth/status

describe('post /api/users', () => {
    let app
    beforeAll(async () => {

        await mongoose
            .connect("mongodb://localhost:27017/express_test")
            .then(() => console.log("Connected to test database"))
            .catch((err) => console.error("test Database connection error:", err));
        app = createApp()
    })


    it("should return 201 when user is created", async () => {
        const response = await request(app).post('/api/users').send({
            username: "test",
            password: "test"
        })
        expect(response.status).toBe(201)
    })

    it("should log the user in", async () => {
        const loginResponse = await request(app)
            .post('/api/auth').send({
                username: "test",
                password: "test"
            })
        expect(loginResponse.status).toBe(201)
        const cookies = loginResponse.header['set-cookie']
        expect(cookies).toBeDefined();
        const statusResponse = await request(app).get('/api/auth/status').set('Cookie', cookies)
        expect(statusResponse.status).toBe(201)
        expect(statusResponse.text).toBe("User authenticated successfully ")

    })


    afterAll(async () => {
        //await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
})