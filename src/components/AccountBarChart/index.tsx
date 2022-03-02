/* eslint-disable react/require-default-props */
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ReactComponent as Empty } from 'assets/images/empty.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface Props {
  isLoading?: boolean;
  data?: { [key: string]: number } | null;
}

const AccountBarChart = ({ data, isLoading = false }: Props) => {
  const chartData = data
    ? Object.entries(data).map(([key, value]) => ({ name: key, value }))
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
            <Bar dataKey="value" name="Total accounts" fill="#1890ff" />
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

export default AccountBarChart;
