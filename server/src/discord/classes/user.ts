import rawUser from '../typings/rawUser';

export default class User {
  id: string;
  username: string;
  discriminator: string;
  bot: boolean | undefined;
  avatar: string | null;
  tag: string;
  constructor(data: rawUser) {
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.bot = data.bot;
    this.avatar = data.avatar;
    this.tag = `${this.username}#${this.discriminator}`;
  }
}
