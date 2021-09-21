import ManagerDashboard from 'pages/manager/Dashboard';
import { RouteProps } from 'react-router-dom';

import Login from '../pages/auth/Login';

const routes: Array<RouteProps> = [
  {
    path: '/login',
    exact: true,
    component: Login,
  },
  {
    path: '/manager',
    component: ManagerDashboard,
  },
];

export default routes;
