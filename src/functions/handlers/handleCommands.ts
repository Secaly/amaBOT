import { Client, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { ExecutableSlashCommand } from 'src/types';

const readCommands = async (client: Client): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> => {
  const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  await Promise.all(
    readdirSync('./src/commands').map(async (folder) => {
      const commandFiles = readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.ts'));

      switch (folder) {
        // SLASH COMMANDS
        case 'slashCommands':
          await Promise.all(
            commandFiles.map(async (file) => {
              const x = await import(`../../commands/${folder}/${file}`);
              const command: ExecutableSlashCommand = x.command;

              client.executableSlashCommands.set(command.data.name, command);
              body.push(command.data.toJSON());

              console.log(`Slash Command : ${command.data.name} has been registered.`);
            }),
          );
          break;
        default:
          break;
      }
    }),
  );

  return body;
};

export const handle = async (client: Client): Promise<void> => {
  const body = await readCommands(client);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    console.log(`Started refreshing application ('/') commands.`);
    console.log(`Commands number : ${body.length}.`);
    await rest.put(Routes.applicationCommands(process.env.BOT_ID), {
      body: body,
    });
    console.log(`Application ('/') commands refreshed.`);
  } catch (error) {
    console.error(error);
  }
};
