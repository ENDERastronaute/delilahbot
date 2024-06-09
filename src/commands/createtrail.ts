import {
    CommandInteraction, GuildMemberRoleManager,
    Poll,
    PollAnswerData,
    PollData,
    PollQuestionMedia,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("createtrail")
        .setDescription("Crée une randonnée à l'aide des sondages")
        .addStringOption(option =>
            option
                .setName("titre")
                .setDescription("Le titre")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("reponse_1")
                .setDescription("The first answer")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("reponse_2")
                .setDescription("La 2e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_3")
                .setDescription("La 3e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_4")
                .setDescription("La 4e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_5")
                .setDescription("La 5e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_6")
                .setDescription("La 6e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_7")
                .setDescription("La 7e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_8")
                .setDescription("La 8e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_9")
                .setDescription("La 9e réponse")
                .setRequired(false))
        .addStringOption(option =>
            option
                .setName("reponse_10")
                .setDescription("La 10e réponse")
                .setRequired(false)),

    async execute(interaction: CommandInteraction) {
        if (!(interaction.member!.roles as GuildMemberRoleManager).cache.has('1249309771803394048')) {
            return interaction.reply({ content: "T'as pas le droit", ephemeral: true });
        }

        const trails_channel = await interaction.client.channels.fetch(process.env.TRAILS_CHANNEL_ID as string) as TextChannel;

        const answers: PollAnswerData[] = [];

        for (let i = 1; i < 11; i++) {
            const value = interaction.options.get(`reponse_${i}`)?.value as string|undefined;

            if (!value) continue;

            answers.push({
                text: value as string,
            })
        }

        const poll: PollData = {
            answers: answers,
            duration: 48,
            allowMultiselect: false,
            question: {
                text: interaction.options.get('titre')?.value as string
            } as PollQuestionMedia
        }

        await trails_channel.send({ poll: poll });

        return interaction.reply({ content: "Sondage créé avec succès" });
    }
}