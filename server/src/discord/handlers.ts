import { EventData, EventTypes, Setting } from '../types';
import DiscordConnectionManager from './discordConnectionManager';

export default class Handlers {
  constructor(private socket: DiscordConnectionManager) {}

  async setEventConfigs(data: { event: EventTypes; key: string; value: any }) {
    const databaseUserData = await this.socket.database.get<Setting | undefined>('SELECT * FROM User WHERE I = 1;');
    if (databaseUserData) {
      const data_: EventData[] = JSON.parse(databaseUserData.eventsData);

      let T = data_.find(f => f.name === data.event);
      if (!T) {
        const newE = (data_[data_.length] = { name: data.event, data: {} } as { name: EventTypes; data: any });
        newE.data[data.key] = data.value;

        this.socket.database.exec(`UPDATE User SET eventsData = '${JSON.stringify(data_)}' WHERE I = 1`);
        return;
      }

      T.data[data.key] = data.value;

      this.socket.database.exec(`UPDATE User SET eventsData = '${JSON.stringify(data_)}' WHERE I = 1`);
    }
  }
}
