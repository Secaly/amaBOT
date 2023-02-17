import { Client, Events } from 'discord.js';
import { BotEvent } from 'src/types';

export const event: BotEvent = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    console.log(`Client ready ! ${client.user?.tag} is logged in and online.`);
  },
};
