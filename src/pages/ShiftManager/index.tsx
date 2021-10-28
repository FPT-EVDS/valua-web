import {
  Announcement,
  AnnouncementOutlined,
  Dashboard as DashboardIcon,
  DashboardOutlined,
  Event,
  EventOutlined,
  Group,
  GroupOutlined,
  Menu as MenuIcon,
  Notifications,
  ReportProblem,
  ReportProblemOutlined,
} from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, Toolbar } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import AvatarProfileMenu from 'components/AvatarProfileMenu';
import CustomDrawer, { DrawerItem } from 'components/CustomDrawer';
import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import DashboardPage from './Dashboard';
import ExamineePage from './Examinee';
import DetailExamineePage from './Examinee/DetailExaminee';
import FeedbackPage from './Feedback';
import DetailFeedbackPage from './Feedback/DetailFeedback';
import Profile from './Profile';
import ShiftPage from './Shift';
import DetailShiftPage from './Shift/DetailShift';
import AddExamRoomPage from './Shift/DetailShift/AddExamRoom';
import ViolationPage from './Violation';
import DetailViolationPage from './Violation/DetailViolation';

const drawerItems: Array<DrawerItem> = [
  {
    name: 'Dashboard',
    icon: <DashboardOutlined />,
    activeIcon: <DashboardIcon color="primary" />,
    to: '/shift-manager/dashboard',
  },
  {
    name: 'Feedback',
    icon: <AnnouncementOutlined />,
    activeIcon: <Announcement color="primary" />,
    to: '/shift-manager/feedback',
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
  {
    name: 'Violation',
    icon: <ReportProblemOutlined />,
    activeIcon: <ReportProblem color="primary" />,
    to: '/shift-manager/violation',
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
          <Box sx={{ display: { xs: 'flex' } }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <AvatarProfileMenu
              profileLink="/shift-manager/profile"
              user={user}
            />
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
          <Route
            path="/shift-manager/dashboard"
            component={DashboardPage}
            exact
          />
          <Route
            path="/shift-manager/feedback"
            component={FeedbackPage}
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
            path="/shift-manager/shift/:id/add"
            component={AddExamRoomPage}
            exact
          />
          <Route
            path="/shift-manager/violation"
            component={ViolationPage}
            exact
          />
          <Route
            path="/shift-manager/violation/:id"
            component={DetailViolationPage}
          />
          <Route
            path="/shift-manager/feedback"
            component={FeedbackPage}
            exact
          />
          <Route
            path="/shift-manager/feedback/:id"
            component={DetailFeedbackPage}
          />
          <Route path="/shift-manager/profile" component={Profile} exact />
          <Redirect from="/shift-manager" to="/shift-manager/dashboard" />
        </Switch>
      </Box>
    </Box>
  );
};

export default ShiftManagerDashboard;
