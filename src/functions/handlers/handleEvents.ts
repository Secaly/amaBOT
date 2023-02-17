import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { BotEvent } from 'src/types';

export const handle = async (client: Client): Promise<void> => {
  readdirSync('./src/events').map(async (folder) => {
    const eventFiles = readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.ts'));

    switch (folder) {
      // CLIENT EVENTS
      case 'client':
        await Promise.all(
          eventFiles.map(async (file) => {
            const x = await import(`../../events/${folder}/${file}`);
            const event: BotEvent = x.event;

            event.once
              ? client.once(event.name, async (...args: any) => event.execute(...args, client))
              : client.on(event.name, async (...args: any) => event.execute(...args, client));

            console.log(`Client Event : ${event.name} has been registered.`);
          }),
        );
        break;
      default:
        break;
    }
  });
};
