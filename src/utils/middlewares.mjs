import { request } from "http";
import mockUsers from "./constants.mjs";

const resolveUserIndex = (request, response, next) => {
    const { body, params: { id } } = request
    const parsedId = parseInt(id)
    // Correctly check if parsedId is NaN
    if (isNaN(parsedId)) {
        return response.status(400).send("Error: Invalid ID");
    }

    // Find the index of the user with the given ID
    const index = mockUsers.findIndex((user) => user.id === parsedId);


    // Check if the user was found
    if (index === -1) {
        return response.status(404).send("User not found");
    }

    request.findUserIndex = index

    next()

}

const authUser = (request, response, next) => {
    const { body: { username, password } } = request
    const findUser = mockUsers.find(user => user.username === username)
    if (!findUser || findUser.password != password) {
        return response.status(401).send("Bad cridantials ")
    }
    request.user = findUser
    next()
}

export { resolveUserIndex, authUser };
