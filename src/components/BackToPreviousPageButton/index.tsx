import { ChevronLeft } from '@mui/icons-material';
import { Box } from '@mui/material';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  route: string;
  title: string;
}

const BackToPreviousPageButton = ({ route, title }: Props) => {
  const history = useHistory();
  return (
    <Box
      maxWidth={250}
      display="flex"
      alignItems="center"
      onClick={() => history.push(route)}
      sx={{ cursor: 'pointer' }}
    >
      <ChevronLeft />
      <div>{title}</div>
    </Box>
  );
};

export default BackToPreviousPageButton;
