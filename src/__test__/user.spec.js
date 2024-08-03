import validator, { validationResult } from "express-validator"
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs"
import mockUsers from "../utils/constants.mjs"
import User from "../mongoose/schema/user.mjs"
import helpers from "../utils/helper.mjs"
import exp from "constants"


jest.mock("express-validator", () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => false),
        array: jest.fn(() => [{ msg: "error" }])
    })),
    matchedData: jest.fn(() => ({
        username: "test",
        password: "password",
        displayName: "test_name",
    })),
}))

jest.mock("../utils/helper.mjs", () => ({
    hashPassword: jest.fn(() => "password")
}))

jest.mock("../mongoose/schema/user.mjs");


const mockRequest = {
    //You should five mock data an actual data ,data that you will get from the database
    findUserIndex: 1
}
const mockResponse = {
    send: jest.fn(),
    sendStatus: jest.fn(),
    status: jest.fn()

}
describe('get user by id', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should return a user by id', async () => {
        getUserByIdHandler(mockRequest, mockResponse)
        expect(mockResponse.send).toHaveBeenCalledWith(mockUsers[mockRequest.findUserIndex])
        expect(mockResponse.sendStatus).not.toHaveBeenCalled()
        expect().toHa
    })
    it("should return status of 404 if user if not found ", async () => {
        mockRequest.findUserIndex = "a"
        getUserByIdHandler(mockRequest, mockResponse)
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(404)
        expect(mockResponse.sendStatus).toHaveBeenCalledTimes(1)
        expect(mockResponse.send).not.toHaveBeenCalled
    })
})


describe('create user', () => {
    const mockRequest = {}
    it("should return status of 400 if validation fails", async () => {
        await createUserHandler(mockRequest, mockResponse)
        expect(validator.validationResult).toHaveBeenCalledWith(mockRequest)
        expect(validator.validationResult).toHaveBeenCalledTimes(1)
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.status).toHaveBeenCalledTimes(1)
        expect(mockResponse.send).toHaveBeenCalledWith([{ msg: "error" }])
    })

    it("should return a status of 201 if user is created successfully", async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({
            isEmpty: jest.fn(() => true)
        }))

        await createUserHandler(mockRequest, mockResponse)
        expect(validator.matchedData).toHaveBeenCalledTimes(1)
        expect(validator.matchedData).toHaveBeenCalled()
        expect(helpers.hashPassword).toHaveBeenCalledTimes(1)
        expect(helpers.hashPassword).toHaveBeenCalledWith("password")
        expect(User).toHaveBeenCalledTimes(1)
        expect(User).toHaveBeenCalledWith({
            username: "test",
            password: "password",
            displayName: "test_name"
        })
        expect(User.mock.instances[0].save).toHaveBeenCalled()
        expect(mockResponse.status).toHaveBeenCalledWith(201)
        expect(mockResponse.send).toHaveBeenCalled()
    })

    it("should return a status of 400 if username already exists", async () => {
        jest.spyOn(validator, "validationResult").mockImplementationOnce(() => ({ isEmpty: jest.fn(() => true) }))
        User.mockImplementationOnce(() => ({ save: jest.fn(() => { throw { code: 11000 } }) }))
        await createUserHandler(mockRequest, mockResponse)
        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.send).toHaveBeenCalledWith({ error: 'Username already exists' })
    })
})