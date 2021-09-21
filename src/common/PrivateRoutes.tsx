import { Role } from 'enums/role.enums';
import React from 'react';
import { Redirect, Route,RouteProps } from 'react-router-dom';

interface Props extends RouteProps {
  requiredRoles: Array<Role>;
}

const PrivateRoutes = (props: Props) => {
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <Route {...props} />;
};

export default PrivateRoutes;
