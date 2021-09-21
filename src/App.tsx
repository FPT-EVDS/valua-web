import './app.scss';

import ManagerDashboard from 'pages/Manager';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';

const App = (): JSX.Element => (
  <div className="app">
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route path="/manager" component={ManagerDashboard} />
      <Redirect from="/" to="/login" />
    </Switch>
  </div>
);

export default App;
