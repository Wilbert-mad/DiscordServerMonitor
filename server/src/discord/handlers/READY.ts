import User from '../classes/user';
import type DiscordConnectionManager from '../discordConnectionManager';

export default (socket: DiscordConnectionManager, data: any) => {
  socket.client.user = new User(data.user);

  console.log('Client ready event reseved.', 'logedin as', socket.client.user.tag);
};
