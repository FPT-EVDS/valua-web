import { useAppSelector } from 'app/hooks';
import { Role } from 'enums/role.enum';
import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
  // eslint-disable-next-line react/require-default-props
  requiredRole?: Role | null;
}

const PrivateRoute = ({ requiredRole = null, ...routeProps }: Props) => {
  const user = useAppSelector(state => state.auth.user);
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));
  if (!isLoggedIn) return <Redirect to="/login" />;
  if (user) {
    const { role } = user;
    if (role !== requiredRole) {
      if (role === Role.ShiftManager) return <Redirect to="/shift-manager" />;
      if (role === Role.Manager) {
        return <Redirect to="/manager" />;
      }
    }
  }
  return <Route {...routeProps} />;
};

export default PrivateRoute;
