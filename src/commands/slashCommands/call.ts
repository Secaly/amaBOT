import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  SlashCommandBuilder,
} from 'discord.js';
import { Call, ExecutableSlashCommand } from 'src/types';

export const command: ExecutableSlashCommand = {
  data: new SlashCommandBuilder()
    .setName('call')
    .setDescription('Lance un call.')
    .addStringOption((option) => option.setName('name').setDescription('Nom du call').setRequired(true))
    .addIntegerOption((option) => option.setName('number').setDescription('Nombre de joueurs').setRequired(true))
    .addRoleOption((option) => option.setName('role').setDescription('Tag un role (option)'))
    .addBooleanOption((option) =>
      option.setName('force_tag').setDescription(`Tag les utilisateurs même si le call n'est pas complet`),
    ),
  execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
    const member = interaction.guild?.members.cache.get(interaction.user.id);
    if (member?.roles.cache.some((role: { name: string }) => role.name === 'BOYCOTT')) {
      await interaction.reply({
        content: `Vous n'avez pas accès à cette commande.`,
        ephemeral: true,
      });
      return;
    }

    const number = interaction.options.getInteger('number');
    if (!number || number < 2) {
      await interaction.reply({
        content: `Vous devez créer un call de plus de 1 personne.`,
        ephemeral: true,
      });
      return;
    }

    const row = new ActionRowBuilder<ButtonBuilder>();
    row
      .addComponents(new ButtonBuilder().setCustomId('join').setLabel('✅ Dispo !').setStyle(ButtonStyle.Primary))
      .addComponents(new ButtonBuilder().setCustomId('leave').setLabel('Plus dispo !').setStyle(ButtonStyle.Danger))
      .addComponents(new ButtonBuilder().setCustomId('up').setLabel('[Up]').setStyle(ButtonStyle.Success));

    const role = interaction.options.getRole('role');
    const forceTag = interaction.options.getBoolean('force_tag');

    await interaction.reply({
      allowedMentions: { roles: role ? [role.id] : [] },
      content: `Call ${interaction.options.getString('name')} : ${
        interaction.user.username
      }  1/${interaction.options.getInteger('number')} ${role ? `${role}` : ''}`,
      components: [row],
    });

    const reply = await interaction.fetchReply();
    const call: Call = {
      id: reply.id,
      name: interaction.options.getString('name')!,
      number: interaction.options.getInteger('number')!,
      role: role ? role : '',
      users: [interaction.user],
      up: interaction.createdTimestamp,
      time: {
        [interaction.user.username]: interaction.createdTimestamp,
      },
      isEnded: false,
      interaction: interaction,
      message: reply,
      forceTag: forceTag ? forceTag! : false,
    };
    client.calls[reply.id] = call;
  },
};
