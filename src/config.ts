import 'dotenv/config';

const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_ID || !GUILD_ID) {
    throw new Error('environment variables missing');
}

export const config = {
    DISCORD_CLIENT_ID,
    DISCORD_TOKEN,
    GUILD_ID
}