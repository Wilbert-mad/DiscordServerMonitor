import User from './classes/user';
import type DiscordConnectionManager from './discordConnectionManager';
import type Message from './typings/Message';
import type rawMessage from './typings/rawMessage';

export default class DatabaseHandlers {
  constructor(private socket: DiscordConnectionManager) {}

  messageCreate(data: rawMessage): Message {
    this.socket.database.exec(
      `INSERT INTO Messages (
        id, channel_id, 
        guild_id, content, 
        timestamp, type, 
        author, edited_timestamp
      ) VALUES (
        ${data.id}, ${data.channel_id}, 
        ${data.guild_id}, "${data.content}", 
        "${data.timestamp}", ${data.type}, 
        '${JSON.stringify(data.author)}', "${data.edited_timestamp}"
      );`
    );
    return {
      id: data.id,
      channel_id: data.channel_id,
      guild_id: data.guild_id,
      content: data.content,
      timestamp: data.timestamp,
      type: data.type,
      author: data.author,
      edited_timestamp: data.edited_timestamp,
    };
  }
}
