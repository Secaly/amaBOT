import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { Call, ExecutableSlashCommand } from 'src/types';

export const command: ExecutableSlashCommand = {
  data: new SlashCommandBuilder().setName('calls').setDescription('Affiche tous les calls en cours.'),
  execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
    let messageContent = '';

    const callList: Call[] = Object.values(client.calls);

    callList.map((call) => {
      if (call.interaction.guildId === interaction.guildId) {
        if (!call.isEnded) {
          messageContent += `Le call ${call.name} ${call.users.length}/${call.number} :\nhttps://discord.com/channels/${call.interaction.guildId}/${call.interaction.channel.id}/${call.id}\n`;
        }
      }
    });

    if (messageContent === '') {
      await interaction.reply({
        content: `Il n'y a actuellement aucun call.`,
        ephemeral: true,
      });
      return;
    }

    await interaction.reply({
      content: messageContent,
      ephemeral: true,
    });
  },
};
