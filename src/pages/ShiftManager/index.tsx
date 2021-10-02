import {
  Announcement,
  AnnouncementOutlined,
  Dashboard as DashboardIcon,
  DashboardOutlined,
  Event,
  EventOutlined,
  Menu as MenuIcon,
  Notifications,
  ReportProblem,
  ReportProblemOutlined,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from '@mui/material';
import { useAppSelector } from 'app/hooks';
import DrawerContent, { DrawerItem } from 'components/CustomDrawer';
import React, { useState } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';

import DashboardPage from './Dashboard';
import FeedbackPage from './Feedback';
import ShiftPage from './Shift';
import DetailShiftPage from './Shift/DetailShift';
import ViolationPage from './Violation';

const drawerItems: Array<DrawerItem> = [
  {
    name: 'Dashboard',
    icon: <DashboardOutlined />,
    activeIcon: <DashboardIcon />,
    to: '/shift-manager/dashboard',
  },
  {
    name: 'Feedback',
    icon: <AnnouncementOutlined />,
    activeIcon: <Announcement />,
    to: '/shift-manager/feedback',
  },
  {
    name: 'Shift',
    icon: <EventOutlined />,
    activeIcon: <Event />,
    to: '/shift-manager/shift',
  },
  {
    name: 'Violation',
    icon: <ReportProblemOutlined />,
    activeIcon: <ReportProblem />,
    to: '/shift-manager/violation',
  },
];

const ShiftManagerDashboard = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAppSelector(state => state.user.user);
  const drawerWidth = 240;
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

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
            <IconButton size="large" onClick={handleMenu}>
              <Avatar
                src={String(user?.profileImageUrl)}
                alt={String(user?.fullName)}
                sx={{ bgcolor: '#1890ff' }}
              />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 28,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem
                onClick={() => {
                  // FIXME: FIX LOGOUT LOGIC HERE
                  localStorage.removeItem('access_token');
                  history.push('/');
                }}
              >
                Log out
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent items={drawerItems} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          <DrawerContent items={drawerItems} />
        </Drawer>
      </Box>
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
          <Route path="/shift-manager/shift" component={ShiftPage} exact />
          <Route
            path="/shift-manager/shift/add"
            component={DetailShiftPage}
            exact
          />
          <Route path="/shift-manager/shift/:id" component={DetailShiftPage} />
          <Route
            path="/shift-manager/violation"
            component={ViolationPage}
            exact
          />
          <Redirect from="/shift-manager" to="/shift-manager/dashboard" />
        </Switch>
      </Box>
    </Box>
  );
};

export default ShiftManagerDashboard;
