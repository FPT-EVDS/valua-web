import { AccountCircle, Logout } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import User from 'models/user.model';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

interface Props {
  user: User | null;
}

const AvatarProfileMenu = ({ user }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const history = useHistory();

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton size="large" onClick={handleMenu}>
        <Avatar
          src={String(user?.imageUrl)}
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
        <Box sx={{ px: 2.5 }}>
          <Typography variant="subtitle1" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.email}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <MenuItem component={Link} to="/shift-manager/profile">
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>My profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            // FIXME: FIX LOGOUT LOGIC HERE
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            history.push('/');
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarProfileMenu;
