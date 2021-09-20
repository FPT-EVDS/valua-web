import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import logo from 'assets/images/logo.png';
import React, { useState } from 'react';
import './styles.scss';

export type DrawerItem = {
  name: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

interface Props {
  items: Array<DrawerItem>;
}

const DrawerContent = ({ items }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <div>
      <Toolbar>
        <img src={logo} alt="logo" className="logo" />
      </Toolbar>
      <List>
        {items.map(({ name, icon, activeIcon }, index) => (
          <ListItemButton
            key={name}
            selected={selectedIndex === index}
            onClick={event => handleListItemClick(event, index)}
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
