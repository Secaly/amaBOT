import { ChatInputCommandInteraction, Client, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { callUserEdit } from '../../library/messageEdit.js';
import { callCompletReply, callJoinReply } from '../../library/interactionsReplies.js';
import { Call, ExecutableSlashCommand } from 'src/types';

export const command: ExecutableSlashCommand = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Ajoute un utilisateur à un call [ADMIN]')
    .addUserOption((option) => option.setName('user').setDescription('Utilisateur').setRequired(true))
    .addStringOption((option) => option.setName('call').setDescription('Call message ID').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),
  execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
    const callID = interaction.options.getString('call');
    const addUser = interaction.options.getUser('user');

    const call: Call = client.calls[callID];

    if (call.isEnded) {
      await interaction.reply({
        content: `Le call est terminé.`,
        ephemeral: true,
      });
      return;
    }

    if (!call.users.includes(addUser!)) {
      call.users.push(addUser!);
      await callUserEdit(call.message, call);

      if (call.users.length === call.number) {
        call.isEnded = true;
        await callCompletReply(interaction, call);
      } else {
        await callJoinReply(addUser!, interaction, call);
      }

      call.up = interaction.createdTimestamp;
    } else {
      await interaction.reply({
        content: `${addUser!.username} est déjà dans le call ${call.name}.`,
        ephemeral: true,
      });
    }
  },
};
