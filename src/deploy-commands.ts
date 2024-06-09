
import { REST, Routes } from 'discord.js';
import 'dotenv/config';
import path from 'path';
import fs from 'fs'
import { config } from './config';
import Files from "./utils/files";

export default async () => {
    try {
        const commands: any[] = [];

        const commandsPath = path.join(__dirname, 'commands');
        const commandFiles = await Files.getFilesByExtension(commandsPath, 'ts');

        for (let file of commandFiles) {
            let { command } = await import(`./commands/${file}`);

            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());

            } else {
                console.error(`La commande ${command.data.name} n'a pas de propriété "data" ou "execute"`);
            }
        }

        const rest = new REST().setToken(config.DISCORD_TOKEN as string);

        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, config.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
};