import {
  Client,
  User,
  CommandInteraction,
  SlashCommandBuilder,
  ButtonStyle,
  GuildChannel,
  ButtonComponent,
  MessageComponentInteraction,
  Message,
  APIRole,
  Role,
} from 'discord.js';

// DOTENV

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TOKEN: string;
      BOT_ID: string;
    }
  }
}

// DISCORD CLIENT

declare module 'discord.js' {
  export interface Client {
    executableSlashCommands: Collection<string, ExecutableSlashCommand>;
    executableButtonComponents: Collection<string, ExecutableButtonComponent>;
    executableModalComponents: Collection<string, ExecutableModalComponent>;
    executableSelectMenuComponents: Collection<string, ExecutableSelectMenuComponent>;
    calls: Collection<string, Call>;
  }
}

export interface BotEvent {
  name: string;
  once?: boolean;
  execute: (...args) => Promise<void>;
}

// EXECUTABLE CLIENT COLLECTIONS

export interface ExecutableSlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>;
}

export interface ExecutableButtonComponent {
  data: {
    name: string;
  };
  execute: (interaction: MessageComponentInteraction, client: Client, data: string) => Promise<void>;
}

export interface ExecutableModalComponent {
  data: {
    name: string;
  };
  execute: (interaction: ModalMessageModalSubmitInteraction, client: Client) => Promise<void>;
}

export interface ExecutableSelectMenuComponent {
  data: {
    name: string;
  };
  execute: (interaction: StringSelectMenuInteraction, client: Client) => Promise<void>;
}

// CALL

export interface Call {
  id: string;
  name: string;
  number: number;
  role: string | Role | APIRole;
  users: User[];
  up: number;
  time: {
    [key: string]: number;
  };
  isEnded: boolean;
  interaction: ChatInputCommandInteraction;
  message: Message;
  forceTag: boolean;
}

export {};
