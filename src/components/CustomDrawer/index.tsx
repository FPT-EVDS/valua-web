import './styles.scss';

import {
  alpha,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import logo from 'assets/images/logo.png';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export type DrawerItem = {
  name: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  to: string;
};

interface DrawerContentProps {
  items: Array<DrawerItem>;
}

interface CustomDrawerProps extends DrawerContentProps {
  drawerWidth: number;
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const DrawerContent = ({ items }: DrawerContentProps): JSX.Element => {
  const { pathname } = useLocation();
  const theme = useTheme();
  const defaultIndex = items.findIndex(
    item => item.to === pathname || pathname.includes(item.to),
  );
  const [selectedIndex, setSelectedIndex] = useState(
    defaultIndex !== -1 ? defaultIndex : 0,
  );
  const history = useHistory();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    to: string,
  ): void => {
    setSelectedIndex(index);
    history.push(to);
  };

  useEffect(() => {
    setSelectedIndex(
      items.findIndex(
        item => item.to === pathname || pathname.includes(item.to),
      ),
    );
  }, [pathname]);

  const activeSubStyle = {
    borderRight: '3px solid',
    borderColor: alpha(theme.palette.primary.main, 0.8),
  };

  return (
    <div>
      <Toolbar>
        <Box
          component="img"
          sx={{ height: 48, width: 200 }}
          src={logo}
          alt="logo"
          className="logo"
        />
      </Toolbar>
      <List>
        {items.map(({ name, icon, activeIcon, to }, index) => {
          const isActive = selectedIndex === index;
          return (
            <ListItemButton
              key={name}
              selected={isActive}
              onClick={event => handleListItemClick(event, index, to)}
              sx={{
                ...(isActive && activeSubStyle),
              }}
            >
              <ListItemIcon>{isActive ? activeIcon : icon}</ListItemIcon>
              <ListItemText
                primary={name}
                sx={{
                  color: isActive
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </div>
  );
};

const CustomDrawer = ({
  drawerWidth,
  items,
  handleDrawerToggle,
  mobileOpen,
}: CustomDrawerProps) => (
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
      <DrawerContent items={items} />
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
      <DrawerContent items={items} />
    </Drawer>
  </Box>
);

export default CustomDrawer;
