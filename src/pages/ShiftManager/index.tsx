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
import { Client, IFrame, StompSubscription } from '@stomp/stompjs';
import { useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import NotificationMenu from 'components/NotificationMenu';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
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
    to: '/shift-manager/examinee',
  },
  {
    name: 'Shift',
    icon: <EventOutlined />,
    activeIcon: <Event color="primary" />,
    to: '/shift-manager/shift',
  },
  {
    name: 'Report',
    icon: <AssignmentOutlined />,
    activeIcon: <Assignment color="primary" />,
    to: '/shift-manager/report',
  },
];

const WEB_SOCKET_URL = `${String(process.env.REACT_APP_API_URL)}/websocket`;

const ShiftManagerDashboard = (): JSX.Element => {
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
    const data = JSON.parse(payload.body);
    showInfoMessage(data.message);
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

  useEffect(() => {
    if (user && !client.active) {
      client.activate();
    }
  }, [user]);

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
              path="/shift-manager/examinee"
              component={ExamineePage}
              exact
            />
            <Route
              path="/shift-manager/examinee/subject"
              component={DetailExamineePage}
              exact
            />
            <Route path="/shift-manager/shift" component={ShiftPage} exact />
            <Route
              path="/shift-manager/shift/:id"
              component={DetailShiftPage}
              exact
            />
            <Route
              path="/shift-manager/shift/:id/examRoom/add"
              component={AddExamRoomPage}
              exact
            />
            <Route
              path="/shift-manager/shift/:id/examRoom/:examRoomId"
              component={DetailExamRoomPage}
              exact
            />
            <Route path="/shift-manager/report" component={ReportPage} exact />
            <Route
              path="/shift-manager/report/:id"
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
