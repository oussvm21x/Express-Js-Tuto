import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import DiscordUser from "../mongoose/schema/discordUser.mjs";

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const findUserById = await DiscordUser.findById(id)
        if (!findUserById) throw new Error('No use found')
        done(null, findUserById)
    }
    catch (err) {
        done(err, done)
    }



})
passport.use(
    new DiscordStrategy(
        {
            clientID: "1267596274241241142",
            clientSecret: "FZCngmx3RuY0djpUq5ow3tW_Oo88_vxf",
            callbackURL: "http://localhost:3000/api/auth/discord/redirect",
            scope: ["identify"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let findUser = await DiscordUser.findOne({ discordId: profile.id });

                if (!findUser) {
                    console.log("No user , let's create one")
                    const newUser = new DiscordUser({
                        username: profile.username,
                        discordId: profile.id,
                    });
                    const savedUser = await newUser.save();
                    return done(null, savedUser);
                }
                console.log("User exist")
                return done(null, findUser);
            } catch (error) {
                console.error("Error in Discord strategy:", error);
                return done(error, null);
            }
        }
    )
);