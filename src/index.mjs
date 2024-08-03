import { createApp } from "./createApp.mjs";
import mongoose from "mongoose"


mongoose.connect("mongodb://localhost:27017/express")
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error("Database connection error:", err));

const app = createApp()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

//Client id : 1267596274241241142
//Client secret : WcTK14xpwNFrc-gaHjeGpW92yyKZLExD
//redirect url : http://localhost:3000/api/auth/discord/redirect