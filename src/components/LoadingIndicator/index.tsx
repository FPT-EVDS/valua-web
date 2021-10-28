import { Box, BoxProps, CircularProgress } from '@mui/material';
import React from 'react';

const LoadingIndicator = (props: BoxProps) => (
  <Box {...props} display="flex" justifyContent="center" alignItems="center">
    <CircularProgress />
  </Box>
);

export default LoadingIndicator;
