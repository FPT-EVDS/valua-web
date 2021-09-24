import Avatar, { AvatarProps } from '@mui/material/Avatar';
import React from 'react';

interface Props extends AvatarProps {
  name: string;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: '#1890ff',
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const StringAvatar = ({ name, ...rest }: Props) => {
  const newProps = { ...rest, ...stringAvatar(name) };
  return <Avatar {...newProps} />;
};

export default StringAvatar;
