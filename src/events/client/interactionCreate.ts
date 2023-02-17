import { Client, Events, Interaction } from 'discord.js';
import { BotEvent } from 'src/types';

const interactionError = async (interaction: Interaction, error: unknown): Promise<void> => {
  console.error(`Error : ${error}`);
  if (interaction.isRepliable()) {
    if (interaction.deferred) {
      await interaction.editReply({
        content: `something went wrong while executing this command...`,
      });
    } else {
      if (interaction.isRepliable()) {
        await interaction.reply({
          content: `something went wrong while executing this command...`,
          ephemeral: true,
        });
      }
    }
  }
};

export const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  execute: async (interaction: Interaction, client: Client) => {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.executableSlashCommands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        interactionError(interaction, error);
      }
    } else if (interaction.isButton()) {
      const params = interaction.customId.split(`|`);
      const buttonId = params[0];
      const data = params[1];
      const button = interaction.client.executableButtonComponents.get(buttonId);
      if (!button) return;
      try {
        await button.execute(interaction, client, data);
      } catch (error) {
        interactionError(interaction, error);
      }
    }
  },
};
