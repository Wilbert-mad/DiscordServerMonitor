import type { MessageCreateEventData } from '../../types';
import type rawMessage from '../typings/rawMessage';
import Actions from './Action';

const validtypes = [0];

export default class MessageCreate extends Actions {
  async handler(data: rawMessage) {
    if (!validtypes.includes(data.type)) return {};
    const eventData = this.socket.eventData.get('MESSAGE_CREATE');
    const evData = <MessageCreateEventData>eventData!.data;

    if (!evData) return {};
    if (evData.ignoredUsers === undefined) {
      await this.socket.handlers.setEventConfigs({
        event: 'MESSAGE_CREATE',
        key: 'ignoredUsers',
        value: [],
      });
    }
    if (evData.ignoredChannels === undefined) {
      await this.socket.handlers.setEventConfigs({
        event: 'MESSAGE_CREATE',
        key: 'ignoredChannels',
        value: [],
      });
    }

    if (evData.ignoredChannels.includes(data.channel_id)) return {};
    if (evData.ignoredUsers.includes(data.author.id)) return {};

    const message = this.socket.databaseHandlers.messageCreate(data);

    this.socket.emit('@messageCreate', message);

    return message;
  }
}
