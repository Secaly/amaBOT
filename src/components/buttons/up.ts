import { Client, MessageComponentInteraction } from 'discord.js';
import { callUpReply } from '../../library/interactionsReplies.js';
import { Call, ExecutableButtonComponent } from 'src/types';

export const component: ExecutableButtonComponent = {
  data: {
    name: `up`,
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
    if (call.users.includes(interaction.user)) {
      if (interaction.createdTimestamp - call.up > 120000) {
        call.up = interaction.createdTimestamp;
        await callUpReply(interaction, call);
      } else {
        await interaction.reply({
          content: `Le call ${call.name} a déjà été up il y a moins de 2 minutes.`,
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: `Vous n'êtes déjà pas dans le call ${call.name}.`,
        ephemeral: true,
      });
    }
  },
};
