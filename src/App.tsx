import './app.scss';

import { Close } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { IconButton } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import PrivateRoute from 'common/PrivateRoutes';
import OAuth2RedirectHandler from 'components/OAuth2RedirectHandler';
import AppConstants from 'enums/app';
import Role from 'enums/role.enum';
import { getUserProfile } from 'features/auth/authSlice';
import { SnackbarProvider } from 'notistack';
import ManagerDashboard from 'pages/Manager';
import ShiftManagerDashboard from 'pages/ShiftManager';
import React, { RefObject, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import LoginPage from './pages/Login';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const notistackRef: RefObject<SnackbarProvider> = React.createRef();
  const onClickDismiss = (key: string | number) => () => {
    notistackRef.current?.closeSnackbar(key);
  };

  const handleGetProfile = async () => {
    const result = await dispatch(getUserProfile());
    unwrapResult(result);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem(AppConstants.ACCESS_TOKEN);
    if (accessToken) {
      handleGetProfile().catch(() => {
        history.push('/login');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={3}
        ref={notistackRef}
        autoHideDuration={3000}
        action={key => (
          <IconButton onClick={onClickDismiss(key)} color="secondary">
            <Close />
          </IconButton>
        )}
        dense
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Switch>
            <PrivateRoute path="/" exact />
            <PrivateRoute
              requiredRole={Role.Manager}
              path="/manager"
              component={ManagerDashboard}
            />
            <PrivateRoute
              requiredRole={Role.ShiftManager}
              path="/shift-manager"
              component={ShiftManagerDashboard}
            />
            <Route path="/oauth2/redirect" component={OAuth2RedirectHandler} />
            <Route path="/login" exact component={LoginPage} />
          </Switch>
        </LocalizationProvider>
      </SnackbarProvider>
    </div>
  );
};

export default App;
