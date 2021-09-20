import React from 'react';
import { Redirect, RouteProps, Route } from 'react-router-dom';

const PrivateRoutes = (props: RouteProps) => {
  const isLoggedIn = Boolean(localStorage.getItem('access_token'));
  if (!isLoggedIn) return <Redirect to="/login" />;
  return <Route {...props} />;
};

export default PrivateRoutes;
