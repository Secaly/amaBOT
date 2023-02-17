import { Message } from 'discord.js';
import { Call } from 'src/types.js';

export async function callUserEdit(message: Message, call: Call) {
  await message.edit(
    `Call ${call.name} : ${call.users.map((user) => ` ${user.username}`)} ${call.users.length}/${call.number} ${
      call.role
    }`,
  );
}
