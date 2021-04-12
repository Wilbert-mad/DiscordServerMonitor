import type User from '../classes/user';

export default interface rawMessage {
  id: string;
  channel_id: string;
  guild_id: string;
  author: User;
  member: any;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  tts: boolean;
  mention_everyone: boolean;
  mentions: any[];
  mention_roles: any[];
  mention_channels: any[];
  attachments: any[];
  embeds: any[];
  reactions?: any[];
  nonce?: string | number;
  pinned: boolean;
  webhook_id?: string;
  type: number;
  activity: any;
  application: any;
  message_reference?: any;
  flags: number;
  stickers: any[];
  referenced_message?: rawMessage | null;
  interaction: any;
}
