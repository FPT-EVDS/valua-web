import {
  Architecture,
  ArchitectureOutlined,
  Class,
  ClassOutlined,
  Dashboard as DashboardIcon,
  DashboardOutlined, Input,
  InputOutlined,
  LocationOn,
  LocationOnOutlined, Logout, LogoutOutlined,
  Menu as MenuIcon,
  School,
  SchoolOutlined, Settings, SettingsOutlined,
  SupervisorAccount,
  SupervisorAccountOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { Client, IFrame, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SockJS from 'sockjs-client';

import Dashboard from './Dashboard';

const drawerItems: Array<DrawerItem> = [
  {
    name: 'Dashboard',
    icon: <DashboardOutlined />,
    activeIcon: <DashboardIcon color="primary" />,
    to: '/dashboard',
  },
  {
    name: 'Import',
    icon: <InputOutlined />,
    activeIcon: <Input color="primary" />,
    to: '/input',
  },
  {
    name: 'Settings',
    icon: <SettingsOutlined />,
    activeIcon: <Settings color="primary" />,
    to: '/settings',
  },
  {
    name: 'Logout',
    icon: <Logout />,
    activeIcon: <LogoutOutlined color="primary" />,
    to: '/logout',
  },
];

const WEB_SOCKET_URL = `${String(process.env.REACT_APP_API_URL)}/websocket`;

const ManagerDashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showInfoMessage, showErrorMessage } = useCustomSnackbar();
  const account = useAppSelector(state => state.authentication.account);
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null,
  );
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
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <AvatarProfileMenu
              account={account}
              path="/profile"
            />
          </Stack>
        </Toolbar>
      </AppBar>
      <CustomDrawer
        drawerWidth={drawerWidth}
        items={drawerItems}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />
      <Box
        component="main"
        sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} exact />
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Container>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
