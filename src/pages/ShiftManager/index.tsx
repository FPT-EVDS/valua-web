import {
  Assignment,
  AssignmentOutlined,
  Dashboard as DashboardIcon,
  DashboardOutlined,
  Event,
  EventOutlined,
  Groups,
  GroupsOutlined,
  Menu as MenuIcon,
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
import NotificationMenu from 'components/NotificationMenu';
import { getConfig } from 'features/config/configSlice';
import { addNotification } from 'features/notification/notificationsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Notification from 'models/notification.model';
import ProfilePage from 'pages/Profile';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SockJS from 'sockjs-client';

import DashboardPage from './Dashboard';
import ExamineePage from './Examinee';
import DetailExamineePage from './Examinee/DetailExaminee';
import ReportPage from './Report';
import DetailReportPage from './Report/DetailReport';
import ShiftPage from './Shift';
import DetailShiftPage from './Shift/DetailShift';
import AddExamRoomPage from './Shift/DetailShift/AddExamRoom';
import DetailExamRoomPage from './Shift/DetailShift/DetailExamRoom';

const drawerItems: Array<DrawerItem> = [
  {
    name: 'Dashboard',
    icon: <DashboardOutlined />,
    activeIcon: <DashboardIcon color="primary" />,
    to: '/shift-manager/dashboard',
  },
  {
    name: 'Examinee',
    icon: <GroupsOutlined />,
    activeIcon: <Groups color="primary" />,
    to: '/shift-manager/examinees',
  },
  {
    name: 'Shift',
    icon: <EventOutlined />,
    activeIcon: <Event color="primary" />,
    to: '/shift-manager/shifts',
  },
  {
    name: 'Report',
    icon: <AssignmentOutlined />,
    activeIcon: <Assignment color="primary" />,
    to: '/shift-manager/reports',
  },
];

const WEB_SOCKET_URL = `${String(process.env.REACT_APP_API_URL)}/websocket`;

const ShiftManagerDashboard = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { showInfoMessage, showErrorMessage } = useCustomSnackbar();
  const user = useAppSelector(state => state.auth.user);
  const [subscription, setSubscription] = useState<StompSubscription | null>(
    null,
  );
  const drawerWidth = 240;

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const onMessageReceived = (payload: IFrame) => {
    if (payload) {
      const data = JSON.parse(payload.body).notification as Notification;
      dispatch(addNotification(data));
      showInfoMessage('You received a new notification');
    }
  };

  const client = new Client({
    brokerURL: WEB_SOCKET_URL,
    webSocketFactory: () => new SockJS(WEB_SOCKET_URL),
    onConnect: () => {
      const clientSubscribtion = client.subscribe(
        `/web/notification/${String(user?.companyId)}`,
        onMessageReceived,
      );
      setSubscription(clientSubscribtion);
    },
    onStompError: frame => {
      showErrorMessage(frame.headers.message);
    },
  });

  const handleLogout = async () => {
    if (subscription) {
      subscription.unsubscribe();
      setSubscription(null);
    }
    client.forceDisconnect();
    await client.deactivate();
  };

  const handleGetConfig = async () => {
    const result = await dispatch(getConfig());
    unwrapResult(result);
  };

  useEffect(() => {
    if (user && !client.active) {
      client.activate();
    }
  }, [user]);

  useEffect(() => {
    handleGetConfig().catch(error => showErrorMessage(error));
  }, []);

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
            <NotificationMenu />
            <AvatarProfileMenu
              user={user}
              path="/shift-manager/profile"
              logoutCallback={handleLogout}
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
            <Route
              path="/shift-manager/dashboard"
              component={DashboardPage}
              exact
            />
            <Route
              path="/shift-manager/examinees"
              component={ExamineePage}
              exact
            />
            <Route
              path="/shift-manager/examinees/subject"
              component={DetailExamineePage}
              exact
            />
            <Route path="/shift-manager/shifts" component={ShiftPage} exact />
            <Route
              path="/shift-manager/shifts/:id"
              component={DetailShiftPage}
              exact
            />
            <Route
              path="/shift-manager/shifts/:id/exam-rooms/add"
              component={AddExamRoomPage}
              exact
            />
            <Route
              path="/shift-manager/shifts/:id/exam-rooms/:examRoomId"
              component={DetailExamRoomPage}
              exact
            />
            <Route path="/shift-manager/reports" component={ReportPage} exact />
            <Route
              path="/shift-manager/reports/:id"
              component={DetailReportPage}
            />
            <Route
              path="/shift-manager/profile"
              component={ProfilePage}
              exact
            />
            <Redirect from="/shift-manager" to="/shift-manager/dashboard" />
          </Switch>
        </Container>
      </Box>
    </Box>
  );
};

export default ShiftManagerDashboard;
