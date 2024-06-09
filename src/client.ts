
import {Client, Collection} from 'discord.js';

const client = new Client({
    intents: ["Guilds", "GuildMessagePolls", "GuildMessages", "DirectMessages"]
})

export default client;