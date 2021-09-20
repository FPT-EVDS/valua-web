import { RouteProps } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';

export const authRoutes: [RouteProps] = [
  {
    path: '/login',
    exact: true,
    component: LoginPage,
  },
];
