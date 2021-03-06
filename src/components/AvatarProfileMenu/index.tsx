import { AccountCircle, Logout, Settings } from '@mui/icons-material';
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
import SettingDialog from 'components/SettingDialog';
import AppConstants from 'enums/app';
import User from 'models/user.model';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

interface Props {
  user: User | null;
  path: string;
  // eslint-disable-next-line react/require-default-props
  logoutCallback?: () => Promise<void>;
}

const AvatarProfileMenu = ({ user, path, logoutCallback }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
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
          src={user?.imageUrl ?? undefined}
          alt={String(user?.fullName)}
        />
      </IconButton>
      <SettingDialog open={open} handleClose={() => setOpen(false)} />
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
        <MenuItem component={Link} to={path}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          <ListItemText>My profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setOpen(true)}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={async () => {
            localStorage.removeItem(AppConstants.ACCESS_TOKEN);
            localStorage.removeItem(AppConstants.REFRESH_TOKEN);
            if (logoutCallback) await logoutCallback();
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
