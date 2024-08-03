import passport from "passport";
import { Strategy } from "passport-local";
import User from "../mongoose/schema/user.mjs";
import { comparePassword } from "../utils/helper.mjs";

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUserById = await User.findById(id)
        if (!findUserById) throw new Error('No use found')
        done(null, findUserById)
    }
    catch (err) {
        done(err, done)
    }



})
passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username })
            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            if (!comparePassword(password, user.password)) {
                return done(null, false, { message: "Password incorrect" });
            }
            return done(null, user);
        }
        catch (error) {
            console.log(error)
            return done(error);
        }

    })
)