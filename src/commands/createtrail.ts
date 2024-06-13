import {
    ActionRowBuilder,
    CommandInteraction,
    GuildMemberRoleManager,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    PollAnswerData,
    PollData,
    SlashCommandBuilder,
    TextChannel,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName("createtrail")
        .setDescription("Crée une randonnée à l'aide des sondages"),

    async execute(interaction: CommandInteraction) {
        if (!(interaction.member!.roles as GuildMemberRoleManager).cache.has('1249309771803394048')) {
            return interaction.reply({ content: "T'as pas le droit", ephemeral: true });
        }

        const trails_channel = await interaction.client.channels.fetch(process.env.TRAILS_CHANNEL_ID as string) as TextChannel;

        const modal = new ModalBuilder()
            .setCustomId('trail_creation')
            .setTitle('Créer un trail')

        const locationsInput = new TextInputBuilder()
            .setCustomId('locations')
            .setLabel('Quels lieux (max 10, \\n)')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)

        const specialItemsInput = new TextInputBuilder()
            .setCustomId('special_items')
            .setRequired(true)
            .setLabel('Quels objets à prendre (\\n)')
            .setStyle(TextInputStyle.Paragraph)

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(locationsInput);
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(specialItemsInput);

        modal.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(modal);

        await interaction.followUp({ content: 'En attente de la création du sondage...' })

        const filter = (i: ModalSubmitInteraction) => i.customId === 'trail_creation';
        const modalInteraction = await interaction.awaitModalSubmit({ filter, time: 300_000 });

        const locationsParagraph = modalInteraction.fields.getTextInputValue('locations');
        const specialItemsParagraph = modalInteraction.fields.getTextInputValue('special_items');

        const locations = locationsParagraph.split('\n');
        const specialItems = specialItemsParagraph.split('\n');

        const trail

        const answers: PollAnswerData[] = [];

        locations.forEach(location => {
            answers.push({
                text: location
            })
        })

        const poll: PollData = {
            answers: answers,
            duration: 4,
            allowMultiselect: false,
            question: {
                text: "Lieux de la randonnée"
            }
        }

        await trails_channel.send({ poll: poll });

        await modalInteraction.reply({ content: 'Sondage créé avec succès' });
    }
}