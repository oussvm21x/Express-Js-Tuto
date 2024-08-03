import mainRoute from "./routes/routes.mjs";
import cookieParser from 'cookie-parser'
import session from "express-session"
import { checkSchema } from "express-validator";
import { itemValidator } from "./utils/schemaValidator.mjs";
import passport from "passport"
import "./strategy/localStrategy.mjs"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import "./strategy/discordStrategy.mjs"
import express from "express"



export function createApp() {

    const app = express()

    app.use(express.json())
    app.use(cookieParser("hello world"))
    app.use(session({
        secret: "hello world",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    }));

    app.use(passport.initialize())
    app.use(passport.session())
    app.use(mainRoute)


    app.get('/', (request, response) => {

        response.status(201).send('Hello')

    })
    app.post("/api/auth",
        passport.authenticate("local"),
        (request, response) => {
            response.status(201).send("OK")

        })

    app.get('/api/auth/status', (request, response) => {

        if (request.user) {
            return response.status(201).send("User authenticated successfully ")
        }
        response.status(401).send({ msg: "not authenticated" })

    })

    app.post('/api/card', checkSchema(itemValidator), (request, response) => {
        const { body: item } = request
        console.log(item)
        if (!request.session.user) return response.status(401).send("you're not authentificated")
        const { cart } = request.session
        if (cart) { cart.push(item) }
        else request.session.cart = [item]
        return response.status(201).send(item)
    })

    app.get('/api/card/list', (request, response) => {
        if (request.session.user && request.session.cart) {
            return response.status(201).send(request.session.cart)
        }
        else if (!request.session.user) response.status(401).send({ msg: "not authenthificated" })
        else response.status(401).send({ msg: "empty card" })


    })

    app.post('/api/auth/logout', (request, response) => {
        request.logout((err) => {
            if (err) throw err
            response.status(201).send("logout successfully")
        })
    })

    app.get('/api/auth/discord', passport.authenticate("discord"))
    app.get('/api/auth/discord/redirect',
        passport.authenticate('discord', { failureRedirect: '/' }),
        (req, res) => {
            console.log('Discord callback route hit');
            if (req.user) {
                console.log('User authenticated:', req.user);
                res.status(201).send('Authenticated successfully');
            } else {
                console.log('User authentication failed or not found');
                res.status(401).send('Authentication failed');
            }
        }
    );
    return app
}