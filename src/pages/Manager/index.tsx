import {
  Architecture,
  ArchitectureOutlined,
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
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material';
import { Client, IFrame, StompSubscription } from '@stomp/stompjs';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import NotificationMenu from 'components/NotificationMenu';
import { addNotification } from 'features/notification/notificationsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Notification from 'models/notification.model';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SockJS from 'sockjs-client';

import ProfilePage from '../Profile';
import AccountPage from './Account';
import DetailAccountPage from './Account/DetailAccount';
import Dashboard from './Dashboard';
import RoomPage from './Room';
import DetailRoomPage from './Room/DetailRoom';
import SemesterPage from './Semester';
import DetailSemesterPage from './Semester/DetailSemester';
import SubjectPage from './Subject';
import ToolPage from './Tool';

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
    to: '/manager/accounts',
  },
  {
    name: 'Subject',
    icon: <ClassOutlined />,
    activeIcon: <Class color="primary" />,
    to: '/manager/subjects',
  },
  {
    name: 'Tools',
    icon: <ArchitectureOutlined />,
    activeIcon: <Architecture color="primary" />,
    to: '/manager/tools',
  },
  {
    name: 'Semester',
    icon: <SchoolOutlined />,
    activeIcon: <School color="primary" />,
    to: '/manager/semesters',
  },
  {
    name: 'Room',
    icon: <LocationOnOutlined />,
    activeIcon: <LocationOn color="primary" />,
    to: '/manager/rooms',
  },
];

const WEB_SOCKET_URL = `${String(process.env.REACT_APP_API_URL)}/websocket`;

const ManagerDashboard = (): JSX.Element => {
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
              path="/manager/profile"
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
            <Route path="/manager/dashboard" component={Dashboard} exact />
            <Route path="/manager/accounts" component={AccountPage} exact />
            <Route path="/manager/accounts/:id" component={DetailAccountPage} />
            <Route path="/manager/rooms" component={RoomPage} exact />
            <Route path="/manager/rooms/:id" component={DetailRoomPage} />
            <Route path="/manager/semesters" component={SemesterPage} exact />
            <Route
              path="/manager/semesters/:id"
              component={DetailSemesterPage}
            />
            <Route path="/manager/subjects" component={SubjectPage} exact />
            <Route path="/manager/tools" component={ToolPage} exact />
            <Route path="/manager/profile" component={ProfilePage} exact />
            <Redirect from="/manager" to="/manager/dashboard" />
          </Switch>
        </Container>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;
