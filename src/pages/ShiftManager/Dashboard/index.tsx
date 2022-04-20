import {
  Assignment,
  ChevronRight,
  EventOutlined,
  Groups,
  Info,
  Inventory,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { blue, green, indigo, red, teal } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CustomTooltip from 'components/CustomTooltip';
import DashboardCard from 'components/DashboardCard';
import ExamRoomScheduler from 'components/ExamRoomScheduler';
import LoadingIndicator from 'components/LoadingIndicator';
import ReportChart from 'components/ReportChart';
import {
  getReportOverview,
  getShiftOverview,
  getSubjectExamineeOverview,
} from 'features/shiftManagerDashboard/shiftManagerDashboardSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { subjectExaminee, report, shift } = useAppSelector(
    state => state.shiftManagerDashboard,
  );

  const fetchSubjectExaminees = () => {
    dispatch(getSubjectExamineeOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  const fetchReports = () => {
    dispatch(getReportOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  const fetchShifts = () => {
    dispatch(getShiftOverview())
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  useEffect(() => {
    fetchSubjectExaminees();
    fetchReports();
    fetchShifts();
  }, []);

  return (
    <Box component="div">
      <Typography variant="h1" fontSize={28} mb={2} fontWeight="bold">
        {subjectExaminee.data
          ? `${subjectExaminee.data.currentSemester.semesterName} dashboard`
          : 'Overview dashboard'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          {/* Shift card */}
          <DashboardCard
            color={blue[500]}
            subtitle="Total shifts"
            title={shift.data ? shift.data.totalShifts.toString() : ''}
            isLoading={shift.isLoading}
            icon={<EventOutlined />}
          >
            <Typography color="textSecondary" variant="caption" fontSize={13}>
              {shift.data?.message}
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={green[600]}
            subtitle="Total reports"
            isLoading={report.isLoading}
            title={report.data ? report.data.totalReports.toString() : ''}
            icon={<Assignment />}
          >
            <Typography variant="caption" color="textSecondary" fontSize={13}>
              Unresolved:{' '}
              <Typography
                variant="caption"
                fontWeight="bold"
                color={
                  report.data && report.data.totalUnresolved > 0
                    ? red[500]
                    : green[500]
                }
                fontSize={13}
              >
                {report.data?.totalUnresolved}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          {/* Examinee card */}
          <DashboardCard
            color={teal[500]}
            subtitle="Total assignments"
            isLoading={subjectExaminee.isLoading}
            title={
              subjectExaminee.data
                ? subjectExaminee.data.totalAssignments.toString()
                : ''
            }
            icon={<Groups />}
          >
            <Typography color="textSecondary" variant="caption" fontSize={13}>
              Assigned:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                color={green[500]}
                marginX={0.7}
                fontWeight="700"
              >
                {subjectExaminee.data?.assigned}
              </Typography>
              | Unassigned:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                color={red[500]}
                fontWeight="700"
              >
                {subjectExaminee.data?.unassigned}
              </Typography>
              | Exempted:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                {subjectExaminee.data?.exempted}
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          {/* Resources card */}
          <Card sx={{ height: '100%' }}>
            <CardContent>
              {!subjectExaminee.isLoading ? (
                <>
                  <Grid
                    container
                    spacing={3}
                    marginBottom={1}
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                        fontWeight={700}
                      >
                        Resources
                      </Typography>
                      <Stack spacing={0.25}>
                        <Typography
                          display="inline"
                          variant="caption"
                          fontSize={13}
                        >
                          Total rooms: {subjectExaminee.data?.totalRooms}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            display="inline"
                            variant="caption"
                            fontSize={13}
                          >
                            Total supervisors:{' '}
                            {parseInt(
                              String(subjectExaminee.data?.totalStaffs),
                              10,
                            ) +
                              parseInt(
                                String(subjectExaminee.data?.totalTeachers),
                                10,
                              )}
                          </Typography>
                          <CustomTooltip
                            title={`${String(
                              subjectExaminee.data?.totalTeachers,
                            )} teachers , ${String(
                              subjectExaminee.data?.totalStaffs,
                            )} staffs`}
                          >
                            <Info sx={{ fontSize: 13 }} color="info" />
                          </CustomTooltip>
                        </Stack>
                        <Stack spacing={0.25}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              display="inline"
                              variant="caption"
                              fontSize={13}
                            >
                              Total examinees:{' '}
                              {subjectExaminee.data?.totalExaminees}
                            </Typography>
                            <CustomTooltip
                              title={`${String(
                                subjectExaminee.data?.totalSeats,
                              )} seats max`}
                            >
                              <Info sx={{ fontSize: 13 }} color="info" />
                            </CustomTooltip>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item>
                      <Avatar
                        sx={{
                          backgroundColor: indigo[500],
                          height: 56,
                          width: 56,
                        }}
                      >
                        <Inventory />
                      </Avatar>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <LoadingIndicator />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={2}>
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
                    Shift schedule
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    component={RouterLink}
                    to="/shift-manager/shifts"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography fontSize={15} color="primary">
                      View detail
                    </Typography>
                    <ChevronRight color="primary" fontSize="small" />
                  </Stack>
                </Box>
              }
            />
            <CardContent>
              {!shift.isLoading && shift.data !== null ? (
                <>
                  <ExamRoomScheduler shifts={shift.data.shifts} />
                </>
              ) : (
                <LoadingIndicator />
              )}
            </CardContent>
          </Card>
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
                    Report
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    alignItems="center"
                    component={RouterLink}
                    to="/shift-manager/reports"
                    sx={{ textDecoration: 'none' }}
                  >
                    <Typography fontSize={15} color="primary">
                      View detail
                    </Typography>
                    <ChevronRight color="primary" fontSize="small" />
                  </Stack>
                </Box>
              }
            />
            <CardContent sx={{ height: 350 }}>
              <ReportChart
                isLoading={report.isLoading}
                data={report.data?.reportsOfWeek}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
