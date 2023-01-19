import { useAppSelector } from 'app/hooks';
import AppConstants from 'enums/app';
import Role from 'enums/role.enum';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
  // eslint-disable-next-line react/require-default-props
  requiredRole?: Role | null;
}

const PrivateRoute = ({ requiredRole = null, ...routeProps }: Props) => {
  const account = useAppSelector(state => state.authentication.account);
  const isLoggedIn = Boolean(localStorage.getItem(AppConstants.ACCESS_TOKEN));
  if (!isLoggedIn) return <Redirect to="/login" />;
  if (account) {
    const role = account.users[0].roles[0].name;
    if (role !== requiredRole) {
      if (role === Role.Manager) {
        return <Redirect to="/" />;
      }
    }
  }
  return <Route {...routeProps} />;
};

export default PrivateRoute;