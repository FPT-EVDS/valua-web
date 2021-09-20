import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { authRoutes } from './routes';
import './app.scss';

interface Props {}

const App = (props: Props) => {
  return (
    <div className="app">
      <Switch>
        {authRoutes.map((route, index) => (
          <Route {...route} />
        ))}
        <Redirect from="/" to="/login" />
      </Switch>
    </div>
  );
};

export default App;
