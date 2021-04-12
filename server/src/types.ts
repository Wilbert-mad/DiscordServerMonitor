import type DiscordConnectionManager from './discord/discordConnectionManager';

export interface DiscordPayload {
  op: number;
  d?: any;
  s?: number;
  t?: EventTypes;
}

export type handler = <D extends Object>(socket: DiscordConnectionManager, data: D) => any;

export type EventTypes =
  | 'READY'
  | 'RESUMED'
  | 'GUILD_CREATE'
  | 'GUILD_DELETE'
  | 'GUILD_UPDATE'
  | 'INVITE_CREATE'
  | 'INVITE_DELETE'
  | 'GUILD_MEMBER_ADD'
  | 'GUILD_MEMBER_REMOVE'
  | 'GUILD_MEMBER_UPDATE'
  | 'GUILD_MEMBERS_CHUNK'
  | 'GUILD_ROLE_CREATE'
  | 'GUILD_ROLE_DELETE'
  | 'GUILD_ROLE_UPDATE'
  | 'GUILD_BAN_ADD'
  | 'GUILD_BAN_REMOVE'
  | 'GUILD_EMOJIS_UPDATE'
  | 'GUILD_INTEGRATIONS_UPDATE'
  | 'CHANNEL_CREATE'
  | 'CHANNEL_DELETE'
  | 'CHANNEL_UPDATE'
  | 'CHANNEL_PINS_UPDATE'
  | 'MESSAGE_CREATE'
  | 'MESSAGE_DELETE'
  | 'MESSAGE_UPDATE'
  | 'MESSAGE_DELETE_BULK'
  | 'MESSAGE_REACTION_ADD'
  | 'MESSAGE_REACTION_REMOVE'
  | 'MESSAGE_REACTION_REMOVE_ALL'
  | 'MESSAGE_REACTION_REMOVE_EMOJI'
  | 'USER_UPDATE'
  | 'PRESENCE_UPDATE'
  | 'TYPING_START'
  | 'VOICE_STATE_UPDATE'
  | 'VOICE_SERVER_UPDATE'
  | 'WEBHOOKS_UPDATE';

export interface EventData {
  name: EventTypes;
  data?: any;
}

export interface MessageCreateEventData {
  ignoredChannels: string[];
  ignoredUsers: string[];
}

export interface Setting {
  I: number;
  TOKEN: string;
  LOGIN_TOKEN: string;
  eventsData: string;
}
