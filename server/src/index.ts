import websoket from 'ws';
import { open, Database as sDatabase } from 'sqlite';
import { Database, Statement } from 'sqlite3';
import path from 'path';
import { AuthFaildIdefity, Payload, AuthFaildUserExist, AuthPassed, InvalidToken, UnknownError, Relog, MessageCreate } from './events';
import DiscordConnectionManager from './discord/discordConnectionManager';
import { Setting } from './types';
import Message from './discord/typings/Message';

// load database
let database: sDatabase<Database, Statement>;
(async () => {
  database = await open({
    driver: Database,
    filename: path.join(__dirname, '..', 'database.sql'),
  });
  database
    .migrate({
      migrationsPath: path.join(__dirname, '..', 'data'),
    })
    .then(() => console.log('Migrations loaded'));
})();

// 26 long random ID/code
function randomCODE() {
  const car = 'abcdefghijklmnopqrswtxyz1234567890';
  let code = '';
  for (let index = 0; index < 25; index++) {
    const id = car[Math.floor(Math.random() * car.length)];
    code += id;
  }
  return code;
}

export class ws {
  wss: websoket.Server;
  logedin = false;
  _manager: DiscordConnectionManager | null = null;
  constructor() {
    this.wss = new websoket.Server({ port: 7102 });

    this.wss.on('connection', ws => {
      ws.on('message', async message => await this.HandleMessage(message, ws));

      // handle pass code await time
      // @set This most likely will be set to about 5-10 minutes
      setTimeout(() => {
        if (!this.logedin) ws.close(1000);
      }, 60000);
    });
    this.wss.on('listening', () => console.log('Connection ready'));
    this.wss.on('close', () => this.HandleClose());
    this.wss.on('error', e => console.log(e));
  }

  private HandleClose() {
    this.logedin = false;
    console.log('connection faild restart?');
  }

  get manager(): DiscordConnectionManager {
    if (this._manager) return this._manager;
    return (this._manager = new DiscordConnectionManager(database));
  }

  // setUndefined<T>(data: T): { [key: string]: undefined } {
  //   const undefinedData: any = {};
  //   for (const [key] of <[keyof T, any][]>Object.entries(data)) undefinedData[key] = undefined;

  //   return undefinedData;
  // }

  // parseUser(rawUser: Setting | undefined) {
  //   if (!rawUser) return undefined;
  //   const data: Setting & { readonly eventsData: any } = this.setUndefined(rawUser);
  //   for (const [key, vaule] of <[keyof Setting, keyof Setting][]>Object.entries(rawUser)) {
  //     // if (key !== 'eventsData') data[key] = vaule;
  //   }
  //   return data;
  // }

  private async HandleMessage(data: websoket.Data, ws: websoket) {
    const payload: Payload = JSON.parse(data as string);
    const user = await database.get<Setting | undefined>('SELECT * FROM User WHERE I = 1;');

    // const user = this.parseUser(rawUser);
    //eventsData: rawUser ? JSON.parse(rawUser.eventsData) : undefined

    switch (payload.op) {
      // create the main user of this server connection
      case '@create-user': {
        const token = payload.data.Token;

        if (this.logedin) return;
        if (user) return ws.send(AuthFaildUserExist);
        const manager = this.manager;
        let proc = true;
        // @bug Some time it may return true but i would need to hide the button or limit requests so the backend dosent get spamed
        manager
          .connect(token)
          .on('tokenInvalid', () => {
            proc = false;
            console.log('invalid token detected');
            ws.send(InvalidToken);
          })
          .on('@messageCreate', (message: Message) => {
            console.log(message);

            ws.send(MessageCreate(JSON.stringify(message)));
          });

        setTimeout(async () => {
          if (!proc) return ws.send(UnknownError);
          // create user
          const code = randomCODE();
          database.exec(`INSERT INTO User(I, token, LOGIN_TOKEN) VALUES(1, "${token}", "${code}")`);
          const refeched = await database.get<Setting | undefined>('SELECT * FROM User WHERE I = 1;');
          ws.send(AuthPassed(code, refeched as Setting));
        }, 1000);
        break;
      }

      case '@reloaded': {
        if (!this.logedin || payload.data.t == false) return;

        if (!user) return;
        ws.send(AuthPassed(user.LOGIN_TOKEN, user));
        break;
      }

      // log back in
      case '@login': {
        const loginToken = payload.data.LOGIN_TOKEN;
        if (!user) return;
        if (this.logedin) return ws.send(Relog);
        if (user.LOGIN_TOKEN !== loginToken) return ws.send(AuthFaildIdefity);
        this.logedin = true;

        const client = this.manager;
        let _Q = true;

        // @bug Some time it may return true but i would need to hide the button or limit requests so the backend dosent get spamed
        client
          .connect(user.TOKEN)
          .on('tokenInvalid', () => {
            _Q = false;
            this.logedin = false;
            return;
          })
          .on('@messageCreate', (message: Message) => {
            console.log(message);

            ws.send(MessageCreate(JSON.stringify(message)));
          });
        _Q && ws.send(AuthPassed(user.LOGIN_TOKEN, user));
        break;
      }
    }
  }

  connectToClient() {}
}

new ws();
