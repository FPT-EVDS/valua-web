import {
  Class,
  ClassOutlined,
  Dashboard as DashboardIcon,
  DashboardOutlined,
  LocationOn,
  LocationOnOutlined,
  Menu as MenuIcon,
  School,
  SchoolOutlined,
  SupervisorAccount,
  SupervisorAccountOutlined,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import ProfilePage from '../Profile';
import AccountPage from './Account';
import DetailAccountPage from './Account/DetailAccount';
import Dashboard from './Dashboard';
import RoomPage from './Room';
import DetailRoomPage from './Room/DetailRoomPage';
import SemesterPage from './Semester';
import DetailSemesterPage from './Semester/DetailSemester';
import SubjectPage from './Subject';

const drawerItems: Array<DrawerItem> = [
  {
    name: 'Dashboard',
    icon: <DashboardOutlined />,
    activeIcon: <DashboardIcon color="primary" />,
    to: '/manager/dashboard',
  },
  {
    name: 'Account',
    icon: <SupervisorAccountOutlined />,
    activeIcon: <SupervisorAccount color="primary" />,
    to: '/manager/account',
  },
  {
    name: 'Room',
    icon: <LocationOnOutlined />,
    activeIcon: <LocationOn color="primary" />,
    to: '/manager/room',
  },
  {
    name: 'Subject',
    icon: <ClassOutlined />,
    activeIcon: <Class color="primary" />,
    to: '/manager/subject',
  },
  {
    name: 'Semester',
    icon: <SchoolOutlined />,
    activeIcon: <School color="primary" />,
    to: '/manager/semester',
  },
];

const ManagerDashboard = (): JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const drawerWidth = 240;

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: '#fff',
        }}
        color="inherit"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={handleDrawerToggle}
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'flex' } }}>
            <AvatarProfileMenu user={user} />
          </Box>
        </Toolbar>
      </AppBar>
      <CustomDrawer
        drawerWidth={drawerWidth}
        items={drawerItems}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Switch>
          <Route path="/manager/dashboard" component={Dashboard} />
          <Route path="/manager/account" component={AccountPage} exact />
          <Route path="/manager/account/:id" component={DetailAccountPage} />
          <Route path="/manager/room" component={RoomPage} exact />
          <Route path="/manager/room/:id" component={DetailRoomPage} />
          <Route path="/manager/semester" component={SemesterPage} exact />
          <Route
            path="/manager/semester/:id"
            component={DetailSemesterPage}
            exact
          />
          <Route path="/manager/subject" component={SubjectPage} exact />
          <Route path="/manager/profile" component={ProfilePage} exact />
          <Redirect from="/manager" to="/manager/dashboard" />
        </Switch>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
