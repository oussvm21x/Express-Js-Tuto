import mongoose, { Types } from "mongoose";

const discordUserSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    discordId: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
});

const DiscordUser = mongoose.model('DiscordUser', discordUserSchema);

export default DiscordUser;
