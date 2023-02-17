import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import * as dotenv from 'dotenv';
import {
  Call,
  ExecutableButtonComponent,
  ExecutableModalComponent,
  ExecutableSelectMenuComponent,
  ExecutableSlashCommand,
} from './types';

dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
});

// Commands collections
client.executableSlashCommands = new Collection<string, ExecutableSlashCommand>();
// Components collections
client.executableButtonComponents = new Collection<string, ExecutableButtonComponent>();
client.executableModalComponents = new Collection<string, ExecutableModalComponent>();
client.executableSelectMenuComponents = new Collection<string, ExecutableSelectMenuComponent>();
// Calls
client.calls = new Collection<string, Call>();

await Promise.all(
  readdirSync('./src/functions').map(async (folder) => {
    const functionFiles = readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.ts'));
    await Promise.all(
      functionFiles.map(async (file, index) => {
        const handler = await import(`./functions/${folder}/${file}`);
        await handler.handle(client);
      }),
    );
  }),
);

setInterval(async () => {
  const callList: Call[] = Object.values(client.calls);

  callList.map((call) => {
    if (!call.isEnded && Date.now() - call.up > 1800000) {
      client.calls[call.id].isEnded = true;
      call.interaction.channel.send({
        content: `Les inscriptions pour le call ${call.name} ${call.users.length}/${call.number} sont terminées ! 😥\n${
          call.forceTag ? call.users.map((user) => user.toString()) : ''
        }`,
        allowedMentions: { parse: ['users'] },
      });
    }
  });
}, 60000);

await client.login(process.env.TOKEN);
