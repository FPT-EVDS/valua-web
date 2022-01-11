import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import illustration from 'assets/images/not-found-page.png';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
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
          Sorry, page not found!
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
          mistyped the URL? Be sure to check your spelling.
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

export default NotFoundPage;
