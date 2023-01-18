import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import illustration from 'assets/images/not-found-page.png';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface ErrorState {
  message: string;
}

const GeneralErrorPage = (props: ErrorState) => {
  const theme = useTheme();
  return (
    <Container
      sx={{
        display: 'flex',
        minHeight: '100%',
        alignItems: 'center',
        paddingTop: theme.spacing(15),
        paddingBottom: theme.spacing(10),
      }}
    >
      <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" paragraph>
          Sorry, there was something went wrong.
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          {props.message}
        </Typography>
        <Box
          component="img"
          src={illustration}
          sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
        />
        <Button to="/" size="large" variant="contained" component={RouterLink}>
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default GeneralErrorPage;
