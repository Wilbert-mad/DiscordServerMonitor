import React, { useState } from 'react';
import ws from '../socketManager';
import LoaderComponent from '../loader';
import { eventEmitter, Events } from '../emiter';
import { setKey } from '../savedKeyManager';

export interface Setting {
  I: number;
  TOKEN: string;
  LOGIN_TOKEN: string;
  eventsData: string;
}

export default function loginMain() {
  // setting type
  const [setting, setSetting] = useState<'existing' | 'connection' | null>(null);
  // websocket statuse
  const wsClosed = ws.closed;

  // Token status
  const [LOGIN_TOKEN, setLOGIN_TOKEN] = useState<string | null>(null);
  const [TOKEN, setTOKEN] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastToken, setPastToken] = useState<string | null>(null);

  // submition
  const [submiting, setSubmiting] = useState(false);

  function ValidateFormExisting() {
    setSubmiting(true);
    if (!LOGIN_TOKEN) {
      setTimeout(() => setSubmiting(false), 1000);
      return setError('Missing token!');
    }
    if (pastToken && LOGIN_TOKEN === pastToken) {
      setTimeout(() => setSubmiting(false), 5000);
      return setError('Login token already rejected last try... or used last try');
    }

    // const wsRegexp = /(ws|wss):\/\/([a-zA-Z0-1])*:?[0-9]{4}?/;
    // if (!wsRegexp.test(data.WS_CONNECTIONSTRIN)) return setError('WebSocket unmached!');
    ws['@login'](LOGIN_TOKEN);
    // let process = true;
    setTimeout(() => setSubmiting(false), 10000);
    ws.on('@UserNotExisting', () => {
      // process = false;

      console.log('Use is not found!');
      setError('Use is not found!');
      setTimeout(() => setSubmiting(false), 5000);
    });
    ws.on('@AuthFaild-IDEF', () => {
      console.log('auth wrong');
      // process = false;
      console.log('Passcode not matching');
      setError('Passcode not matching');
      setPastToken(LOGIN_TOKEN);
      setTimeout(() => setSubmiting(false), 5000);
    });
    ws.once('@AuthLogin', ({ LOGIN_TOKEN: CODE_GEN }) => {
      eventEmitter.dispatch(Events.LOGIN, null);
      setKey(CODE_GEN);
      ws.removeAllListeners('@AuthLogin');
    });
  }

  function ValidateForm() {
    setSubmiting(true);
    if (!TOKEN) {
      setTimeout(() => setSubmiting(false), 1000);
      return setError('Missing token!');
    }
    if (pastToken && TOKEN === pastToken) {
      setTimeout(() => setSubmiting(false), 5000);
      return setError('Token already rejected last try... or used last try');
    }
    // const wsRegexp = /(ws|wss):\/\/([a-zA-Z0-1])*:?[0-9]{4}?/;
    // if (!wsRegexp.test(data.WS_CONNECTIONSTRIN)) return setError('WebSocket unmached!');
    ws['@create-user'](TOKEN);
    // let process = true;
    setTimeout(() => setSubmiting(false), 10000);
    ws.on('@UserExist', () => {
      // process = false;

      console.log('User is already created');
      setError('User is already created');
      // console.log('Use is not found!');
      // setError('Use is not found!');
      setTimeout(() => setSubmiting(false), 5000);
    });
    ws.on('@tokenInvalid', () => {
      // process = false;
      console.log('token is invalid!');
      setError('token is invalid!');
      setPastToken(TOKEN);
      setTimeout(() => setSubmiting(false), 5000);
    });
    ws.once('@AuthLogin', ({ LOGIN_TOKEN }) => {
      eventEmitter.dispatch(Events.LOGIN, null);
      setKey(LOGIN_TOKEN);
      ws.removeAllListeners('@AuthLogin');
    });
  }

  if (wsClosed === true) {
    return <h1>Socket closed</h1>;
  }

  return (
    <>
      {!setting && (
        <>
          <h1 className="flex justify-center text-6xl sm:text-3xl lg:text-8xl">Pixal Monitor</h1>
          <div className="flex justify-center h-72">
            <div className="p-1 flex flex-wrap content-center">
              <button onClick={() => setSetting('connection')} className="p-1 bg-gray-300 rounded-md focus:outline-none">
                Set connection
              </button>
            </div>
            <div className="p-1 flex flex-wrap content-center">
              <button onClick={() => setSetting('existing')} className="p-1 bg-gray-300 rounded-md focus:outline-none">
                Use existing
              </button>
            </div>
          </div>
        </>
      )}
      {setting === 'connection' && (
        <div className="p-1">
          <button onClick={() => setSetting(null)} className="px-3 py-1 bg-red-600 rounded focus:outline-none text-gray-50">
            Quit
          </button>
          <div>
            <div className="text-center">
              <label htmlFor="Token" className="text-3xl">
                Bot Token
              </label>
              <br />
              <input
                onChange={event => setTOKEN(event.currentTarget.value)}
                type="text"
                name="Token"
                id="BOT_TOKEN"
                className="border-2 border-gray-600 animate-pulse rounded-full py-2 px-3 focus:outline-none"
              />
            </div>
            <br />

            {/* <div>
                <label htmlFor="WebSocket">WebSocket</label>
                <br />
                <input onChange={event => setData({ ...data, WS_CONNECTIONSTRIN: event.currentTarget.value })} type="text" name="WebSocket" id="WEB_SOCKET" />
              </div> */}
            {!submiting && (
              <div className="flex justify-center">
                <button onClick={ValidateForm}>Submit</button>
              </div>
            )}
            {submiting && (
              <div className="flex justify-center">
                <LoaderComponent></LoaderComponent>
              </div>
            )}

            {error && <h1 className="text-center text-2xl text-red-500">{error}</h1>}
          </div>
        </div>
      )}
      {setting === 'existing' && (
        <div className="p-1">
          <button onClick={() => setSetting(null)} className="px-3 py-1 bg-red-600 rounded focus:outline-none text-gray-50">
            Quit
          </button>
          <div>
            <div className="text-center">
              <label htmlFor="Token" className="text-3xl">
                Login Token
              </label>
              <br />
              <input
                onChange={event => setLOGIN_TOKEN(event.currentTarget.value)}
                type="text"
                name="Token"
                id="BOT_TOKEN"
                className="border-2 border-gray-600 animate-pulse rounded-full py-2 px-3 focus:outline-none"
              />
            </div>
            <br />

            {!submiting && (
              <div className="flex justify-center">
                <button onClick={ValidateFormExisting}>Submit</button>
              </div>
            )}
            {submiting && (
              <div className="flex justify-center">
                <LoaderComponent></LoaderComponent>
              </div>
            )}

            {error && <h1 className="text-center text-2xl text-red-500">{error}</h1>}
          </div>
        </div>
      )}
    </>
  );
}
