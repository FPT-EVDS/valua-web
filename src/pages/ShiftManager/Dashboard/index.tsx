import { Assignment, EventOutlined, Groups } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { blue, green, red, teal } from '@mui/material/colors';
import DashboardCard from 'components/DashboardCard';
import ExamRoomScheduler from 'components/ExamRoomScheduler';
import ReportChart from 'components/ReportChart';
import { format } from 'date-fns';
import React from 'react';

const DashboardPage = () => {
  const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm');
  return (
    <Box component="div">
      <Grid container spacing={3}>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={blue[500]}
            subtitle="Total shifts"
            title="24"
            icon={<EventOutlined />}
          >
            <Typography color="textSecondary" variant="caption" fontSize={13}>
              First shift starts in: {currentDate}
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={green[600]}
            subtitle="Total reports"
            title="20"
            icon={<Assignment />}
          >
            <Typography variant="caption" color="error" fontSize={13}>
              3 unresolved reports remain
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xl={3} lg={4} md={6} xs={12}>
          <DashboardCard
            color={teal[500]}
            subtitle="Total examinees"
            title="1200"
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
                400
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
                400
              </Typography>
              | Exempted:
              <Typography
                display="inline"
                variant="caption"
                fontSize={13}
                marginX={0.7}
                fontWeight="700"
              >
                400
              </Typography>
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader
              title={
                <Typography
                  sx={{ fontWeight: 'medium', fontSize: 18 }}
                  variant="h5"
                >
                  Exam rooms assigment
                </Typography>
              }
            />
            <CardContent>
              <ExamRoomScheduler />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ height: 400 }} elevation={2}>
            <CardHeader
              title={
                <Typography
                  sx={{ fontWeight: 'medium', fontSize: 18 }}
                  variant="h5"
                >
                  Report
                </Typography>
              }
            />
            <CardContent sx={{ height: 350 }}>
              <ReportChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
