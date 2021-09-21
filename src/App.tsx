import './app.scss';

import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import routes from './routes';

const App = (): JSX.Element => (
  <div className="app">
    <Switch>
      {routes.map(route => (
        <Route {...route} />
      ))}
      <Redirect from="/" to="/login" />
    </Switch>
  </div>
);

export default App;
