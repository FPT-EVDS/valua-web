import './styles.scss';

import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import logo from 'assets/images/logo-under.png';
import backgroundImage from 'assets/images/stacked-waves-haikei.png';
import loginSchema from 'configs/validations/loginSchema';
import LoginDto from 'dtos/login.dto';
import AppConstants from 'enums/app';
import Role from 'enums/role.enum';
import { login } from 'features/auth/authSlice';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import authServices from 'services/auth.service';

interface HistoryState {
  error: Error;
}

const LoginPage = () => {
  const history = useHistory<HistoryState>();
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (payload: LoginDto) => {
      try {
        const result = await dispatch(login(payload));
        const user = unwrapResult(result);
        const {
          token,
          appUser: { role, refreshToken },
        } = user;
        if (role === Role.Manager || role === Role.ShiftManager) {
          localStorage.setItem(AppConstants.ACCESS_TOKEN, token);
          localStorage.setItem(AppConstants.REFRESH_TOKEN, refreshToken);
        }
        if (role === Role.Manager) history.push('/manager');
        else if (role === Role.ShiftManager) history.push('/shift-manager');
        else throw new Error('Invalid role');
      } catch (error) {
        if (error instanceof Error) setErrorMessage(error.message);
        else setErrorMessage(error);
      }
    },
  });

  useEffect(() => {
    if (history.location.state) {
      const { error } = history.location.state;
      setErrorMessage(error.message);
    }
  }, []);

  return (
    <Box
      className="container"
      sx={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Card sx={{ minWidth: '30%', minHeight: '40%', mx: 1 }}>
        <CardContent>
          <Box
            className="logo"
            component="img"
            src={logo}
            display="flex"
            justifyContent="center"
            sx={{ width: 192, height: 192, marginX: 'auto' }}
          />
          <Box
            sx={{
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
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
              />
              <Typography variant="subtitle1" component="div" color={red[500]}>
                {errorMessage}
              </Typography>
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
              <Button
                href={authServices.loginWithGoogle()}
                variant="contained"
                fullWidth
                color="google"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                startIcon={<GoogleIcon />}
              >
                Login with Google
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
