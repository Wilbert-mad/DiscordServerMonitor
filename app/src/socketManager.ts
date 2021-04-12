import { EventEmitter } from 'events';

export interface Payload {
  op: string | null;
  data?: any | null;
}

class ws extends EventEmitter {
  ws: WebSocket;
  closed = false;
  constructor() {
    super();
    this.ws = new WebSocket('ws://localhost:7102');
    this._init();
  }

  ['@login'](LOGIN_TOKEN: string) {
    this.send({
      op: '@login',
      data: { LOGIN_TOKEN },
    });
  }

  ['@create-user'](Token: string) {
    this.send({
      op: '@create-user',
      data: { Token },
    });
  }

  private _init() {
    this.ws.onmessage = ({ data }) => {
      const payload: Payload = JSON.parse(data);
      switch (payload.op) {
        case '@_AuthFaild-UserExist': {
          this.emit('@UserExist');
          break;
        }

        case '@tokenInvalid': {
          this.emit('@tokenInvalid');
          break;
        }

        case '@_AuthFaild-UserNotExisting': {
          this.emit('@UserNotExisting');
          break;
        }

        case '@_AuthFaild-IDEF': {
          this.emit('@AuthFaild-IDEF');
          break;
        }

        case '@AuthPassedLogin': {
          this.emit('@AuthLogin', payload.data);
          break;
        }

        case '@Relog_atempt': {
          this.emit('@Relogin');
          break;
        }

        case '@messageCreate': {
          // console.log(payload.data);

          this.emit('@messageCreate', JSON.parse(payload.data));
          break;
        }
      }
    };

    this.ws.onclose = () => {
      // console.log('closed socket');
      // this.closed = true;
    };
  }

  send<T extends Payload>(data: T) {
    if (this.ws.readyState !== 1) {
      this.closed = true;
      return;
    }
    this.ws.send(JSON.stringify(data));
  }
}

export default new ws();
