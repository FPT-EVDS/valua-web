import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

export interface AvatarWithTextProps {
  src: string;
  color: string;
  title: string;
  // eslint-disable-next-line react/require-default-props
  handleClick?: () => void;
}

const AvatarWithText = ({
  src,
  color,
  title,
  handleClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...props
}: AvatarWithTextProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    onClick={handleClick}
    sx={{ cursor: 'pointer' }}
  >
    <Avatar
      src={src}
      alt={title}
      sx={{ width: 96, height: 96, bgcolor: color, marginBottom: 2 }}
    />
    <Typography>{title}</Typography>
  </Box>
);

export default AvatarWithText;
