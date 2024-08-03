import Route from "express";
import { query, validationResult, matchedData } from "express-validator";
import { schemaValidator } from "../utils/schemaValidator.mjs";
import { resolveUserIndex } from "../utils/middlewares.mjs";
import { checkSchema } from "express-validator";
import mockUsers from "../utils/constants.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const route = Route();

route.get("/api/users",
    (request, response) => {
        const { filter, value } = request.query;
        const { errors } = validationResult(request)
        console.log(request.session)
        console.log(request.session.id)
        request.sessionStore.get(request.session.id, (error, session) => {
            console.log(session)
        }
        )
        // Check if filter and value are provided
        if (!filter && !value) return response.status(201).send(mockUsers);

        if (!filter || !value) return response.status(400).send({ error: "Filter and value query parameters are required" });

        // Ensure mockUsers is defined
        if (!Array.isArray(mockUsers)) return response.status(500).send({ error: "Internal server error" });

        // Validate filter to ensure it's a valid key
        if (!mockUsers.some(user => filter in user)) return response.status(400).send({ error: "Invalid filter key" });

        // Convert value to the appropriate type if needed (example assumes numbers)
        const coercedValue = isNaN(value) ? value : Number(value);

        // Filter users based on the provided filter and value
        const filteredUsers = mockUsers.filter((user) => user[filter].includes(value));
        // Send the filtered users
        response.send(filteredUsers);


    });

route.get("/api/users/:id", resolveUserIndex, getUserByIdHandler)

route.post("/api/users",
    checkSchema(schemaValidator)
    , createUserHandler)


route.put("/api/users/:id", resolveUserIndex, (request, response) => {
    const { body, findUserIndex } = request
    // Update the user data while preserving the ID
    console.log(findUserIndex)
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };

    return response.status(200).send("User updated successfully");

})

route.patch('/api/users/:id', resolveUserIndex, (request, response) => {
    const { body, findUserIndex } = request

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    response.status(200).send("User updated successfully")
})

route.delete('/api/users/:id', resolveUserIndex, (request, response) => {
    mockUsers.splice(index, 1);
    response.status(200).send("User deleted successfully")
})

export default route 