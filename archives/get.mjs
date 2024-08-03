import express, { response } from "express";

//this line initializes a new Express application
const app = express()
const PORT = process.env.PORT || 3000
const mockUsers = [
    {
        id: "1", username: "Oussama", email: "oussama@gmail.com"
    },
    {
        id: "2", username: "Amine", email: "amin@gmail.com"
    },
    {
        id: "1", username: "Karim", email: "karim@gmail.com"
    }

]

//get request 
app.get('/', (request, response) => {

    response.status(201).send("Hello world")

})

app.get("/api/users", (request, response) => {
    const { filter, value } = request.query;

    // Check if filter and value are provided
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

//routers params

//request with id as a prameter 
app.get("/api/users/:id", (request, response) => {
    const { id } = request.params
    const parsedId = parseInt(id)
    console.log(parsedId)
    if (isNaN(parsedId)) {
        return response.send("Error")
    }
    else {
        const user = mockUsers.find((user) => user.id === id)
        if (!user) return response.status(404).send("User not found")
        else return response.status(200).send(user)
    }

})

//this line tells the Express application to listen on port 3000
//app.listen(PORT, callback)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})