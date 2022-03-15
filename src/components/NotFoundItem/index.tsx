import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { ReactComponent as NotFoundLogo } from 'assets/images/not-found.svg';
import React from 'react';

interface Props {
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
  // eslint-disable-next-line react/require-default-props
  message?: string;
}

const NotFoundItem = ({
  isLoading = false,
  message = 'Item not found',
}: Props) => (
  <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
    {isLoading ? (
      <CircularProgress />
    ) : (
      <Stack spacing={2}>
        <NotFoundLogo width="100%" height="100%" />
        <Typography
          variant="caption"
          sx={{ textAlign: 'center', fontSize: '1rem' }}
        >
          {message}
        </Typography>
      </Stack>
    )}
  </Box>
);

export default NotFoundItem;
