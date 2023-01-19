import {
  Architecture,
  Class,
  LocationOn,
  SupervisorAccount,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { blue, green, indigo, red, teal } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DashboardCard from 'components/DashboardCard';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect } from 'react';

const ManagerDashboardPage = () => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const dateFormat = 'dd/MM/yyyy';

  return (
    <Box component="div">

    </Box>
  );
};

export default ManagerDashboardPage;
