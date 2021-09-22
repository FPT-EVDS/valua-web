import './app.scss';

import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import ManagerDashboard from 'pages/Manager';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';

const App = (): JSX.Element => (
  <div className="app">
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/manager" component={ManagerDashboard} />
        <Redirect from="/" to="/login" />
      </Switch>
    </LocalizationProvider>
  </div>
);

export default App;
