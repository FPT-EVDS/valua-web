import './app.scss';

import { Close } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { IconButton } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import ManagerDashboard from 'pages/Manager';
import ShiftManagerDashboard from 'pages/ShiftManager';
import React, { RefObject } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';

const App = (): JSX.Element => {
  const notistackRef: RefObject<SnackbarProvider> = React.createRef();
  const onClickDismiss = (key: string | number) => () => {
    notistackRef.current?.closeSnackbar(key);
  };

  return (
    <div className="app">
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={3}
        ref={notistackRef}
        action={key => (
          <IconButton onClick={onClickDismiss(key)} color="secondary">
            <Close />
          </IconButton>
        )}
        dense
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/manager" component={ManagerDashboard} />
            <Route path="/shift-manager" component={ShiftManagerDashboard} />
            <Redirect from="/" to="/login" />
          </Switch>
        </LocalizationProvider>
      </SnackbarProvider>
    </div>
  );
};

export default App;
