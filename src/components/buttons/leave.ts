import { Client, MessageComponentInteraction, User } from 'discord.js';
import { callLeaveReply } from '../../library/interactionsReplies.js';
import { callUserEdit } from '../../library/messageEdit.js';
import { Call, ExecutableButtonComponent } from 'src/types';

export const component: ExecutableButtonComponent = {
  data: {
    name: `leave`,
  },
  execute: async (interaction: MessageComponentInteraction, client: Client) => {
    const call: Call = client.calls[interaction.message.id];

    if (call.isEnded) {
      await interaction.reply({
        content: `Le call est terminé.`,
        ephemeral: true,
      });

      return;
    }

    if (call.users.includes(interaction.user)) {
      call.users = call.users.filter((user: User) => user !== interaction.user);
      call.time[interaction.user.username] = interaction.createdTimestamp;

      await callUserEdit(interaction.message, call);

      await callLeaveReply(interaction, call);

      call.up = interaction.createdTimestamp;
    } else {
      await interaction.reply({
        content: `Vous n'êtes déjà pas dans le call ${call.name}.`,
        ephemeral: true,
      });
    }
  },
};
