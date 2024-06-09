
import {ActivityType, Client, Events} from "discord.js";

export const event = {
    name: Events.ClientReady,
    once: true,

    execute(client: Client) {
        console.clear();

        client.user!.setActivity('Firewatch', { type: ActivityType.Playing })

        if (!client.user) {
            throw new Error("client is null");
        }

        console.log(`Prêt! Loggé en ${client.user.tag}`);
    }
}