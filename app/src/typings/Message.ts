export default interface Message {
  id: string;
  channel_id: string;
  guild_id: string;
  content: string;
  timestamp: string;
  type: number;
  author: any;
  edited_timestamp?: string | null;
  referenced_message_id?: string | null;
  mentions?: any[];
  attachments?: any[];
}
