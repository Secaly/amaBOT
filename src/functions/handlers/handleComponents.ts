import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { ExecutableButtonComponent, ExecutableModalComponent, ExecutableSelectMenuComponent } from 'src/types';

export const handle = async (client: Client): Promise<void> => {
  readdirSync('./src/components').map(async (folder) => {
    const componentsFiles = readdirSync(`./src/components/${folder}`).filter((file) => file.endsWith('.ts'));

    switch (folder) {
      // BUTTONS
      case 'buttons':
        await Promise.all(
          componentsFiles.map(async (file) => {
            const x = await import(`../../components/${folder}/${file}`);
            const component: ExecutableButtonComponent = x.component;

            client.executableButtonComponents.set(component.data.name, component);

            console.log(`Button Component : ${component.data.name} has been registered.`);
          }),
        );
        break;
      default:
        break;
    }
  });
};
