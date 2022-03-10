import { ChevronRight, Notifications } from '@mui/icons-material';
import {
  Badge,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import Scrollbar from 'components/Scrollbar';
import React, { useState } from 'react';

const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ITEM_HEIGHT = 48;

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

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
        <Badge badgeContent={4} color="error">
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
        <Box sx={{ display: 'flex', alignItems: 'center', py: 1, px: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have 2 unread messages
            </Typography>
          </Box>
        </Box>
        <Scrollbar
          sx={{
            height: { xs: 340, sm: 'auto' },
            maxHeight: ITEM_HEIGHT * 4.5,
          }}
        >
          {options.map(option => (
            <MenuItem key={option} onClick={handleClose}>
              <ListItemText
                primary={
                  <Typography variant="body2" display="block" noWrap>
                    Notification information
                  </Typography>
                }
                secondary={
                  <Typography variant="caption">about 2 hours ago</Typography>
                }
              />
              <ListItemIcon>
                <ChevronRight />
              </ListItemIcon>
            </MenuItem>
          ))}
        </Scrollbar>
      </Menu>
    </div>
  );
};

export default NotificationMenu;
