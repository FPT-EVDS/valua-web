import './styles.scss';

import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import logo from 'assets/images/logo.png';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export type DrawerItem = {
  name: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  to: string;
};

interface Props {
  items: Array<DrawerItem>;
}

const DrawerContent = ({ items }: Props): JSX.Element => {
  const { pathname } = useLocation();
  const defaultIndex = items.findIndex(item => item.to === pathname);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const history = useHistory();

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    to: string,
  ): void => {
    setSelectedIndex(index);
    history.push(to);
  };

  return (
    <div>
      <Toolbar>
        <img src={logo} alt="logo" className="logo" />
      </Toolbar>
      <List>
        {items.map(({ name, icon, activeIcon, to }, index) => (
          <ListItemButton
            key={name}
            selected={selectedIndex === index}
            onClick={event => handleListItemClick(event, index, to)}
          >
            <ListItemIcon>
              {selectedIndex === index ? activeIcon : icon}
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        ))}
      </List>
    </div>
  );
};

export default DrawerContent;
