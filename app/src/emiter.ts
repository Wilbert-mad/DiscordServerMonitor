export enum Events {
  LOGIN = 'Login',
  MAIN = 'main',
}

export const eventEmitter: {
  readonly _events: any;
  dispatch: (event: Events, data: any) => void;
  subscribe: (event: Events, callback: (data: any) => any) => void;
  unsubscribe: (event: Events) => void;
} = {
  _events: {},
  dispatch(event: Events, data: any) {
    if (!this._events[event]) return;
    this._events[event].forEach((callback: any) => callback(data));
  },
  subscribe(event: Events, callback: (data: any) => any) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(callback);
  },
  unsubscribe(event: Events) {
    if (!this._events[event]) return;
    delete this._events[event];
  },
};
