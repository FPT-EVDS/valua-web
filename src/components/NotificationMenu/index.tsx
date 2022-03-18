/* eslint-disable prefer-destructuring */
import { Assignment, ChevronRight, Notifications } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import { green, grey, orange } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { ReactComponent as NotFoundNotifications } from 'assets/images/not-found-notification.svg';
import Scrollbar from 'components/Scrollbar';
import { format } from 'date-fns';
import NotificationStatus from 'enums/notificationStatus.enum';
import Role from 'enums/role.enum';
import {
  getNotifications,
  getUnreadNotifications,
  resetUnreadNotification,
} from 'features/notification/notificationsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Notification from 'models/notification.model';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const ITEM_HEIGHT = 48;

const NotificationMenu = () => {
  const {
    unreadNotifcations,
    current: { notifications },
  } = useAppSelector(state => state.notifications);
  const { user } = useAppSelector(state => state.auth);
  const history = useHistory();
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    dispatch(resetUnreadNotification());
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const fetchUnreadNotifications = () => {
    dispatch(getUnreadNotifications())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(error));
  };

  const fetchNotifications = () => {
    dispatch(getNotifications())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(error));
  };

  const generateNotificationIcon = (status: NotificationStatus) => {
    let backgroundColor = '#1890ff';
    const size = 32;
    let icon = <Notifications fontSize="small" />;
    switch (status) {
      case NotificationStatus.PendingReport:
        backgroundColor = orange[400];
        icon = <Assignment fontSize="small" />;
        break;

      case NotificationStatus.ResolvedReport:
        backgroundColor = green[500];
        icon = <Assignment fontSize="small" />;
        break;

      default:
        break;
    }
    return (
      <Avatar sx={{ backgroundColor, width: size, height: size }}>
        {icon}
      </Avatar>
    );
  };

  const handleNotificationTap = (notification: Notification) => {
    if (user?.role === Role.ShiftManager) {
      history.push(`/shift-manager${notification.route}`);
    } else {
      history.push(`/manager${notification.route}`);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();
    fetchNotifications();
  }, []);

  return (
    <div>
      <IconButton
        size="large"
        onClick={handleMenu}
        aria-controls={open ? 'long-menu' : undefined}
        aria-label="more"
        id="long-button"
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge color="error" badgeContent={unreadNotifcations}>
          <Notifications />
        </Badge>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: '300px',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            overflow: 'inherit',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 20,
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            py: 1,
            px: 2,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">My Notification</Typography>
          </Box>
        </Box>
        <Scrollbar
          sx={{
            height: { xs: 340, sm: 'auto' },
            maxHeight: ITEM_HEIGHT * 4.5,
          }}
        >
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <MenuItem
                key={notification.notificationId}
                onClick={() => {
                  handleNotificationTap(notification);
                }}
              >
                <ListItemAvatar>
                  {generateNotificationIcon(notification.type)}
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" display="block" noWrap>
                      {notification.header}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption">
                      {format(
                        new Date(notification.createdDate),
                        'dd/MM/yyyy HH:mm',
                      )}
                    </Typography>
                  }
                />
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
              </MenuItem>
            ))
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              padding={1}
            >
              <NotFoundNotifications height={120} width={120} />
              <Typography fontSize={14} color={grey[600]} marginTop={2}>
                No notifications found
              </Typography>
            </Box>
          )}
        </Scrollbar>
      </Menu>
    </div>
  );
};

export default NotificationMenu;
