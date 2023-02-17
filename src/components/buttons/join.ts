import { Client, MessageComponentInteraction } from 'discord.js';
import { callCompletReply, callJoinReply } from '../../library/interactionsReplies.js';
import { callUserEdit } from '../../library/messageEdit.js';
import { Call, ExecutableButtonComponent } from 'src/types';

export const component: ExecutableButtonComponent = {
  data: {
    name: `join`,
  },
  execute: async (interaction: MessageComponentInteraction, client: Client) => {
    if (interaction.message.member?.roles.cache.some((role) => role.name === 'BOYCOTT')) {
      await interaction.reply({
        content: `Vous n'avez pas accès à cette commande.`,
        ephemeral: true,
      });

      return;
    }

    const call: Call = client.calls[interaction.message.id];

    if (call.isEnded) {
      await interaction.reply({
        content: `Le call est terminé.`,
        ephemeral: true,
      });

      return;
    }

    if (!call.users.includes(interaction.user)) {
      if (call.time[interaction.user.username]) {
        if (interaction.createdTimestamp - call.time[interaction.user.username] < 60000) {
          await interaction.reply({
            content: `Vous venez de quitter le call ${call.name}, attendez 1 minute.`,
            ephemeral: true,
          });
          return;
        }
      }

      call.users.push(interaction.user);

      await callUserEdit(interaction.message, call);

      if (call.users.length === call.number) {
        call.isEnded = true;
        await callCompletReply(interaction, call);
      } else {
        await callJoinReply(interaction.user, interaction, call);
      }

      call.up = interaction.createdTimestamp;
    } else {
      await interaction.reply({
        content: `Vous êtes déjà dans le call ${call.name}.`,
        ephemeral: true,
      });
    }
  },
};
