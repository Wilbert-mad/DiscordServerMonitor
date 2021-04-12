import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.global.css';
import Dashboard from './pages/dashboard';
import MainLogin from './pages/main';
import LoaderComponent from './loader';

import { eventEmitter, Events } from './emiter';
import { getKey } from './savedKeyManager';
import ws from './socketManager';

const main = () => {
  // const [logedin, setLogin] = useState(false);
  const [page, setPage] = useState<string | null>();
  eventEmitter.subscribe(Events.MAIN, () => setPage('main'));
  eventEmitter.subscribe(Events.LOGIN, () => setPage('dashboard'));
  // const [key, setkey] = useState<string | null>(null);

  const passcode = getKey();
  if (passcode) {
    setTimeout(() => {
      ws.once('@Relogin', () => {
        ws.send({
          op: '@reloaded',
          data: { t: !page },
        });
        ws.removeAllListeners('@Relogin');
      });
      ws['@login'](passcode);

      ws.once('@AuthLogin', () => {
        setPage('dashboard');
        ws.removeAllListeners('@AuthLogin');
      });
    }, 1000);
  } else {
    useEffect(() => eventEmitter.dispatch(Events.MAIN, null), []);
  }

  return (
    <>
      {page === 'main' && <MainLogin />}
      {page === 'dashboard' && <Dashboard />}
      {!page && <LoaderComponent height="50vh" width="100vh" center />}
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/dashboard"
          component={() => {
            return <p>Hello dashboard</p>;
          }}
        />
        <Route path="/" component={main} />
      </Switch>
    </Router>
  );
}
