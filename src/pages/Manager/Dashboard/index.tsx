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
import AccountBarChart from 'components/AccountBarChart';
import DashboardCard from 'components/DashboardCard';
import {
  getAccountOverview,
  getRoomOverview,
  getSemesterOverview,
  getToolOverview,
} from 'features/managerDashboard/managerDashboardSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect } from 'react';

const ManagerDashboardPage = () => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const dateFormat = 'dd/MM/yyyy';
  const { account, room, semester, tool } = useAppSelector(
    state => state.managerDashboard,
  );

  const fetchAccountOverview = () => {
    dispatch(getAccountOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  const fetchRoomOverview = () => {
    dispatch(getRoomOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  const fetchSemesterOverview = () => {
    dispatch(getSemesterOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  const fetchToolOverview = () => {
    dispatch(getToolOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  useEffect(() => {
    fetchAccountOverview();
    fetchRoomOverview();
    fetchSemesterOverview();
    fetchToolOverview();
  }, []);

  return (
    <Box component="div">
      <Typography variant="h1" fontSize={28} mb={2} fontWeight="bold">
        {semester.data
          ? `${semester.data.selectedSemester.semesterName} dashboard`
          : 'Overview dashboard'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          {/* Account card */}
          <DashboardCard
            color={blue[500]}
            subtitle="Total accounts"
            title={account.data ? account.data.totalAccount.toString() : ''}
            isLoading={semester.isLoading}
            icon={<SupervisorAccount />}
          >
            <Typography color="textSecondary" variant="caption" fontSize={13}>
              Examinees:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {account.data?.totalExaminee}
              </Typography>
              | Staffs:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {account.data?.totalStaff}
              </Typography>
              | Shift Manager:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {account.data?.totalShiftManager}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={green[600]}
            subtitle="Total subjects"
            isLoading={semester.isLoading}
            title={semester.data ? String(semester.data.totalSubject) : ''}
            icon={<Class />}
          >
            <Typography variant="caption" color="textSecondary" fontSize={13}>
              Total subjects in {semester.data?.selectedSemester.semesterName}:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {semester.data?.selectedSemester.numOfSubjects}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          {/* Tool card */}
          <DashboardCard
            color={teal[500]}
            subtitle="Total tools"
            isLoading={tool.isLoading}
            title={tool.data ? tool.data.totalTools.toString() : ''}
            icon={<Architecture />}
          >
            <Typography variant="caption" color="textSecondary" fontSize={13}>
              Unused tools:
              <Typography
                variant="caption"
                fontWeight="bold"
                marginX={0.7}
                color={
                  tool.data && tool.data.totalUnusedTools > 0
                    ? red[500]
                    : green[500]
                }
                fontSize={13}
              >
                {tool.data?.totalUnusedTools}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={indigo[500]}
            subtitle="Total rooms"
            isLoading={room.isLoading}
            title={room.data ? String(room.data?.totalRooms) : ''}
            icon={<LocationOn />}
          >
            <Typography variant="caption" color="textSecondary" fontSize={13}>
              Maximum capacity (seats):
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {room.data?.maxCapacity}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ height: 400 }} elevation={2}>
            <CardHeader
              title={
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{ fontWeight: 'medium', fontSize: 18 }}
                    variant="h5"
                  >
                    Accounts per semester
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ height: 350 }}>
              <AccountBarChart
                data={account.data?.accountsPerSemester}
                isLoading={account.isLoading}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboardPage;
