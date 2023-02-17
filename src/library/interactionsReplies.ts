import { ChatInputCommandInteraction, MessageComponentInteraction, User } from 'discord.js';
import { Call } from 'src/types.js';

export async function callCompletReply(
  interaction: MessageComponentInteraction | ChatInputCommandInteraction,
  call: Call,
) {
  await interaction.reply({
    content: `${interaction.user.username} vient de rejoindre le call ${call.name} qui est maintenant COMPLET ! ${
      call.users.length
    }/${call.number}\n${call.users.map((user) => user.toString())} `,
  });
}

export async function callJoinReply(
  addUser: User,
  interaction: MessageComponentInteraction | ChatInputCommandInteraction,
  call: Call,
) {
  await interaction.reply({
    content: `${addUser.username} vient de rejoindre le call ${call.name} ${call.users.length}/${call.number}`,
  });
}

export async function callLeaveReply(interaction: MessageComponentInteraction, call: Call) {
  await interaction.reply({
    content: `${interaction.user.username} vient de quitter le call ${call.name} 😥 ${call.users.length}/${call.number}`,
  });
}

export async function callUpReply(interaction: MessageComponentInteraction, call: Call) {
  await interaction.reply({
    content: `Call ${call.name} : ${call.users.map((user) => ` ${user.username}`)} ${call.users.length}/${
      call.number
    }\n${interaction.message.url}`,
  });
}
