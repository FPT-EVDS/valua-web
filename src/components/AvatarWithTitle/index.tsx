import { Avatar, Stack, Typography } from '@mui/material';
import StringAvatar from 'components/StringAvatar';
import React from 'react';

interface Props {
  // eslint-disable-next-line react/require-default-props
  imageUrl: string | null;
  title: string;
}

const AvatarWithTitle = ({ imageUrl, title }: Props) => (
  <Stack
    direction="row"
    spacing={2}
    justifyItems="inherit"
    alignItems="center"
    maxWidth="inherit"
  >
    {imageUrl ? (
      <Avatar alt={title} src={imageUrl} />
    ) : (
      <StringAvatar name={title} sx={{ justifyContent: 'center' }} />
    )}
    <Typography variant="body2" textOverflow="ellipsis">
      {title}
    </Typography>
  </Stack>
);

export default AvatarWithTitle;
