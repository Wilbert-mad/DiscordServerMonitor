import type DiscordConnectionManager from '../discordConnectionManager';

export default (socket: DiscordConnectionManager, data: any) => {
  socket.actions.MessageCreate.handler(data);
};
