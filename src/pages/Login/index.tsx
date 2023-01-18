import './styles.scss';

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
import AppConstants from 'enums/app';
import { login } from 'features/authentication/authenticationReducer';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import LoginRequestDto from '../../dtos/authentication/loginRequest.dto';
import RoleEnum from 'enums/role.enum';
import { getStatusCodeFromResponse, useErrorStatus } from 'configs/handlers/ErrorHandler';
import ErrorCodeEnum from '../../enums/errorCode.enum';

interface HistoryState {
  error: Error;
}

const LoginPage = () => {
  const history = useHistory<HistoryState>();
  const [errorMessage, setErrorMessage] = useState('');
  const { setErrorCode } = useErrorStatus();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      signature: null
    },
    validationSchema: loginSchema,
    onSubmit: async (payload: LoginRequestDto) => {
      try {
        const result = await dispatch(login(payload));
        const loginResponse = unwrapResult(result);
        const {
          token,
          account,
        } = loginResponse;

        const role = account.users[0].roles[0].name;
        if (role === RoleEnum.ADMIN) {
          localStorage.setItem(AppConstants.ACCESS_TOKEN, token);
          history.push('/manager');
        } else throw new Error('Invalid role');
      } catch (error) {
        const statusCode = getStatusCodeFromResponse(error);
        if (statusCode == ErrorCodeEnum.AUTHENTICATION_INCORRECT_USERNAME_OR_PASSWORD) {
          setErrorMessage(error.message);
        } else {
          setErrorCode(statusCode);
        }
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
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
