import {
  Dashboard as DashboardIcon,
  DashboardOutlined,
  Event,
  EventOutlined,
  Group,
  GroupOutlined,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { AppBar, Box, IconButton, Stack, Toolbar } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import NotificationMenu from 'components/NotificationMenu';
import ProfilePage from 'pages/Profile';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import DashboardPage from './Dashboard';
import ExamineePage from './Examinee';
import DetailExamineePage from './Examinee/DetailExaminee';
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
    icon: <GroupOutlined />,
    activeIcon: <Group color="primary" />,
    to: '/shift-manager/examinee',
  },
  {
    name: 'Shift',
    icon: <EventOutlined />,
    activeIcon: <Event color="primary" />,
    to: '/shift-manager/shift',
  },
];

const ShiftManagerDashboard = (): JSX.Element => {
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
          <Stack
            direction="row"
            alignItems="center"
            spacing={{ xs: 0.5, sm: 1.5 }}
          >
            <NotificationMenu />
            <AvatarProfileMenu user={user} />
          </Stack>
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
          <Route path="/shift-manager/profile" component={ProfilePage} exact />
          <Redirect from="/shift-manager" to="/shift-manager/dashboard" />
        </Switch>
      </Box>
    </Box>
  );
};

export default ShiftManagerDashboard;
