import {
    ActionRowBuilder,
    CommandInteraction,
    GuildMemberRoleManager,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    PollAnswer,
    SlashCommandBuilder,
    TextChannel, TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import dayjs from "dayjs";
import 'dayjs/locale/fr-ch.js'
import updateLocale from "dayjs/plugin/updateLocale";
import {readFile, writeFile} from 'fs/promises';

dayjs.locale('fr-ch')

dayjs.extend(updateLocale);

export const command = {
    data: new SlashCommandBuilder()
        .setName("announcetrail")
        .setDescription("Annonce une randonnée à l'aide des sondages")
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("Date de la randonnée (format ISO 8601, comme YYYY-MM-DD HH:mm)")
                .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        if (!(interaction.member!.roles as GuildMemberRoleManager).cache.has('1249309771803394048')) {
            return interaction.reply({ content: "T'as pas le droit", ephemeral: true });
        }

        const trails_channel = await interaction.client.channels.fetch(process.env.TRAILS_CHANNEL_ID as string) as TextChannel;
        const news_channel = await interaction.client.channels.fetch(process.env.NEWS_CHANNEL_ID as string) as TextChannel;

        try {
            const trail: { locations?: string[], specialItems?: string[] } = await JSON.parse(await readFile('./src/trails.json', 'utf-8'))

            if (!Object.keys(trail).includes('locations')) {
                await interaction.reply({ content: "Aucun trail n'attend d'être annoncé.", ephemeral: true })
                return;
            }

            const messages = await trails_channel.messages.fetch({limit: 50});

            const message = messages.at(0);

            if (message && message.poll) {
                let selectedAnswer = message.poll.answers.at(0) as PollAnswer;

                for (let i = 0; i < message.poll.answers.size; i++) {
                    const answer = message.poll.answers.at(i) as PollAnswer;

                    if (answer?.voteCount > selectedAnswer.voteCount) {
                        selectedAnswer = answer;
                    }
                }

                const date = dayjs(interaction.options.get('date')?.value as string);

                const days = [
                    'Dimanche',
                    'Lundi',
                    'Mardi',
                    'Mercredi',
                    'Jeudi',
                    'Vendredi',
                    'Samedi',
                ]

                let content = `Attention <@&1249309687237709884>! Une nouvelle randonnée à été organisée!\n\nElle se passera à **${selectedAnswer.text}** le **${days[date.day()].toLowerCase()} ${date.date()} ${date.format('MMMM')} ${date.year()}**.`;

                if (trail.specialItems?.length !== 0) {
                    content += `\n\nIl vous faudra ramener :\n`;

                    trail.specialItems?.forEach(item => {
                        content += `- ${item}\n`;
                    })
                }

                await writeFile('./src/trails.json', '{}');

                await news_channel.send({content: content})

                if (!message.poll.resultsFinalized) {
                    await message.poll.end();
                }
            }
        } catch {
            return interaction.reply({content: "Erreur lors de l'annonce de la randonnée", ephemeral: true});
        }

        return interaction.reply({ content: "Randonnée annoncée avec succès" })
    }
}