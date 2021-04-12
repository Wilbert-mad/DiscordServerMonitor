import User from './classes/user';
import type DiscordConnectionManager from './discordConnectionManager';

export default class ClientData {
  public guilds = new Map();
  public user: null | User = null;
  constructor(socket: DiscordConnectionManager) {}
}
