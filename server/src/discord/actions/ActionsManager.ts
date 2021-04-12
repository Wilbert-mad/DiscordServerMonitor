import DiscordConnectionManager from '../discordConnectionManager';

import { default as MessageCreate } from './MessageCreate';

export default class ActionsManager {
  MessageCreate!: MessageCreate;
  constructor(private socket: DiscordConnectionManager) {
    this.register(MessageCreate);
  }

  private register(Action: any) {
    // @ts-ignore-next-line
    this[Action.name.replace(/Action$/, '')] = new Action(this.socket);
  }
}
