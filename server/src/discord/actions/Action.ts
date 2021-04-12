import DiscordConnectionManager from '../discordConnectionManager';
export default class Actions {
  constructor(public socket: DiscordConnectionManager) {}

  public handler(data: any) {
    return data;
  }
}
