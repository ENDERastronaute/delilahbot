import url from 'url';
import path from 'path';
import fs from 'fs';
import client from '../client';
import { Collection } from 'discord.js';
import Files from './files';

export default class Handler {
    static async loadEvents() {
        try {
            const eventsPath = path.join(__dirname, '../events');
            const eventFiles = await Files.getFilesByExtension(eventsPath, 'ts')

            for (const file of eventFiles) {
                let { event } = await import(`../events/${file}`);

                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args));
                }
                else {
                    client.on(event.name, (...args) => event.execute(...args));
                }
            }

            console.info('Events chargés');

        } catch (err) {
            console.log(err)
            console.error('Erreur durent le chargement des events');

            process.exit(1);
        }
    }

    static async loadCommands() {
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = await Files.getFilesByExtension(commandsPath, 'ts')

        let commandNumber = commandFiles.length;
        let loadedCommandsNumber = 0;

        client.commands = new Collection();

        for (const file of commandFiles) {
            let { command } = await import(`../commands/${file}`);

            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);

                loadedCommandsNumber += 1;

            }
            else {
                console.error(`La commande ${command.data.name} n'a pas de propriété "data" ou "execute".`)
            }
        }

        console.info(`${loadedCommandsNumber}/${commandNumber} commands loaded`)
    }
}