
import {Events, Interaction} from 'discord.js';

export const event = {
    name: Events.InteractionCreate,
    on: true,

    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`Aucune commande ${interaction.commandName} n'a été trouvée`);
                return;
            }

            try {
                await command.execute(interaction);

            } catch (err) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command', ephemeral: true });

                }
                else {
                    await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true })
                }

                console.log(err);

                console.warn(`Erreur durant l'éxécution de la commande ${interaction.commandName}`);
            }

        } else {
            return;
        }
    }
}