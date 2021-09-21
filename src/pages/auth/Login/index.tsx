import './styles.scss';

import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import GoogleLoginButton from 'components/GoogleLoginButton';
import React from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();
  return (
    <div className="container">
      <Card sx={{ minWidth: '40%', minHeight: '60%', mx: 2 }}>
        <CardContent>
          <div className="logo">
            <Logo width={72} height={72} />
          </div>
          <Typography
            variant="h2"
            sx={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            gutterBottom
          >
            Exam Violation Detection System
          </Typography>
          <Box
            sx={{
              marginTop: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box component="form" noValidate>
              <TextField
                margin="normal"
                label="Email"
                variant="outlined"
                inputMode="email"
                type="email"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <TextField
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <Box display="flex" justifyContent="right" my={1}>
                <Link href="#" underline="hover">
                  Forgot your password?
                </Link>
              </Box>
              {/* FIXME: button should be submit to call api */}
              <Button
                type="submit"
                fullWidth
                onClick={() => history.push('/manager')}
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                Log In
              </Button>
              <Divider light>OR</Divider>
              <GoogleLoginButton />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
