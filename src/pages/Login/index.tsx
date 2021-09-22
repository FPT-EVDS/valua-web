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
import { red } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { login } from 'app/userSlice';
import { ReactComponent as Logo } from 'assets/images/logo.svg';
import backgroundImage from 'assets/images/stacked-waves-haikei.png';
import GoogleLoginButton from 'components/GoogleLoginButton';
import LoginDto from 'dtos/login.dto';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (payload: LoginDto) => {
      try {
        const result = await dispatch(login(payload));
        unwrapResult(result);
        history.push('/manager');
      } catch (error) {
        setErrorMessage(error);
      }
    },
  });

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
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
            <Box component="form" noValidate onSubmit={formik.handleSubmit}>
              <TextField
                name="email"
                margin="normal"
                label="Email"
                variant="outlined"
                inputMode="email"
                type="email"
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <TextField
                name="password"
                margin="normal"
                label="Password"
                onChange={formik.handleChange}
                type="password"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
              <Typography variant="subtitle1" component="div" color={red[500]}>
                {errorMessage}
              </Typography>
              <Box display="flex" justifyContent="right" my={1}>
                <Link href="#" underline="hover">
                  Forgot your password?
                </Link>
              </Box>
              {/* FIXME: button should be submit to call api */}
              <Button
                type="submit"
                fullWidth
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
