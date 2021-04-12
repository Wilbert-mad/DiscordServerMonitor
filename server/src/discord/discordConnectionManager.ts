import EventEmitter from 'events';
import WebSocket from 'ws';
import { DiscordPayload, handler, Setting, EventData, EventTypes } from '../types';
import path from 'path';
import ClientData from './clientData';
import { Database, Statement } from 'sqlite3';
import sqlite from 'sqlite';
import ActionsManager from './actions/ActionsManager';
import Handlers from './handlers';
import DatabaseHandlers from './databaseHandlers';

const defaultEvents: EventData[] = [
  { name: 'READY' },
  {
    name: 'MESSAGE_CREATE',
    data: {
      ignoredChannels: [],
      ignoredUsers: [],
    },
  },
];

const discordGateWay = 'wss://gateway.discord.gg/?v=6&encoding=json';
export default class DiscordConnectionManager extends EventEmitter {
  public ws?: WebSocket;
  public token?: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastHeartbeatAcked = true;
  public client = new ClientData(this);
  public actions = new ActionsManager(this);
  public database: sqlite.Database<Database, Statement>;
  public eventData = new Map<EventTypes, EventData>();
  public handlers = new Handlers(this);
  public databaseHandlers = new DatabaseHandlers(this);

  constructor(database: sqlite.Database<Database, Statement>) {
    super();
    this.database = database;
  }

  connect(token: string) {
    token && (this.token = token);
    const ws = (this.ws = new WebSocket(discordGateWay));

    // load database events data
    (async () => {
      const databaseUserData = await this.database.get<Setting | undefined>('SELECT * FROM User WHERE I = 1;');

      if (databaseUserData) {
        const data: EventData[] = JSON.parse(databaseUserData.eventsData);

        for (const E of defaultEvents) this.eventData.set(E.name, E);
        for (const E of data) this.eventData.set(E.name, E); // default event should get overrighted if the data has it
      }
    })();

    ws.onmessage = this.messageHandler.bind(this);
    ws.onerror = this.handlerError.bind(this);
    ws.onclose = this.handlerClose.bind(this);

    return this;
  }

  sendPayload(data: DiscordPayload) {
    if (this.ws && this.ws.readyState !== 1) return;
    this.ws!.send(JSON.stringify(data));
  }

  handlerClose({ reason }: WebSocket.CloseEvent) {
    if (reason.includes('Authentication failed.')) this.emit('tokenInvalid');

    this.setHeartbeatTimer(-1);
    // If we still have a connection object, clean up its listeners
    if (this.ws) this._cleanupConnection();

    console.log(reason);
  }

  handlerError() {
    console.log('error');
  }

  async messageHandler({ data }: WebSocket.MessageEvent) {
    const payload: DiscordPayload = JSON.parse(data as string);
    // console.log(payload);

    switch (payload.op) {
      case 10:
        this.identify();
        this.setHeartbeatTimer(<number>payload.d.heartbeat_interval);
        break;

      case 9:
        this.identify();
        break;

      case 11:
        this.lastHeartbeatAcked = true;
        break;

      case 0:
        break;

      case 7:
        this.destroy({ code: 4000 });
        break;

      default:
        console.log(payload);
        break;
    }

    let eventIn = false;
    for (const event_ of this.eventData.values())
      if (payload.t === event_.name) {
        eventIn = true;
        break;
      }

    if (payload.t && eventIn) {
      try {
        const { default: handler }: { default: handler } = await import(path.join(__dirname, 'handlers', `${payload.t}.js`));
        await handler(this, payload.d);
      } catch (_e) {
        console.log(`[WARNING] "${payload.t}" handler not found!\n`, _e.message);
      }
    }
  }

  setHeartbeatTimer(time: number) {
    if (time === -1) {
      if (this.heartbeatInterval) this.heartbeatInterval = null;
      return;
    }

    if (this.heartbeatInterval) this.heartbeatInterval = null;
    this.heartbeatInterval = setInterval(() => this.sendHeartbeat(), time);
  }

  sendHeartbeat() {
    if (!this.lastHeartbeatAcked) {
      this.destroy({ code: 4009 });
      return;
    }

    this.lastHeartbeatAcked = false;
    this.sendPayload({ op: 1, d: null });
  }

  identify() {
    this.sendPayload({
      op: 2,
      d: {
        token: this.token,
        intents: 513,
        properties: {
          $os: 'linux',
          $browser: 'pixal',
          $device: 'pixal',
        },
      },
    });
  }

  destroy({ code = 1000 } = {}) {
    this.setHeartbeatTimer(-1);
    if (this.ws) {
      if (this.ws!.readyState === 1) {
        this.ws.close(code);
      } else {
        this._cleanupConnection();
      }

      try {
        this.ws.close(code);
      } catch {}
    }
  }

  _cleanupConnection() {
    this.ws!.onopen = this.ws!.onclose = this.ws!.onerror = this.ws!.onmessage = () => {};
  }
}
