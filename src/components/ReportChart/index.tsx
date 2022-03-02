/* eslint-disable react/require-default-props */
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ReactComponent as Empty } from 'assets/images/empty.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import { format } from 'date-fns';
import ReportOfWeek from 'dtos/reportOfWeek.dto';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  isLoading?: boolean;
  data?: ReportOfWeek[] | null;
}

const ReportChart = ({ data, isLoading = false }: Props) => {
  const chartData = data
    ? data.map(report => ({
        name: format(new Date(report.date), 'dd/MM'),
        vr: report.violationReports,
        ir: report.incidentReports,
      }))
    : [];
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        {isLoading ? (
          <LoadingIndicator />
        ) : chartData.length > 0 ? (
          <BarChart width={730} height={250} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="vr" name="Violation report" fill="#47B881" />
            <Bar dataKey="ir" name="Incident report" fill="#1890FF" />
            <Label value="Pages of my website" position="center" color="#000" />
          </BarChart>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Empty height={200} />
            <Typography fontSize={18} color={grey[600]} marginTop={2}>
              No data
            </Typography>
          </Box>
        )}
      </ResponsiveContainer>
    </Box>
  );
};

export default ReportChart;
