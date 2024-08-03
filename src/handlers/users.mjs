import mockUsers from "../utils/constants.mjs"
import User from "../mongoose/schema/user.mjs"
import { hashPassword } from "../utils/helper.mjs";
import { validationResult, matchedData } from "express-validator";

export const getUserByIdHandler = (request, response) => {
    const { findUserIndex } = request;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return response.sendStatus(404);
    return response.send(findUser);
};


export const createUserHandler = async (request, response) => {
    const result = validationResult(request)
    if (!result.isEmpty()) {
        response.status(400)
        return response.send(result.array())
    }
    const data = matchedData(request)
    data.password = hashPassword(data.password)
    const newUser = new User(data)
    try {
        const savedUser = await newUser.save()
        return response.status(201).send("User created successfully")

    }
    catch (error) {
        if (error.code === 11000) { // Duplicate key error
            response.status(400)
            return response.send({ error: 'Username already exists' });
        }
        console.log(error)
        response.status(500)
        return response.send("An error occurred while saving the user")
    }
    // console.log(newUser)

}