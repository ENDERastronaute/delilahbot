import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Répond pong"),

    async execute(interaction: CommandInteraction) {
        return interaction.reply("pong");
    }
}