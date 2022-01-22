import { Box } from '@mui/material';
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

const ReportChart = () => {
  const data = [
    {
      name: '15/01',
      vr: 5,
      ir: 10,
    },
    {
      name: '16/01',
      vr: 17,
      ir: 9,
    },
    {
      name: '17/01',
      vr: 5,
      ir: 5,
    },
    {
      name: '18/01',
      vr: 9,
      ir: 0,
    },
    {
      name: '19/01',
      vr: 0,
      ir: 0,
    },
    {
      name: '20/01',
      vr: 0,
      ir: 0,
    },
    {
      name: '21/01',
      vr: 0,
      ir: 0,
    },
  ];
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="vr" name="Violation report" fill="#47B881" />
          <Bar dataKey="ir" name="Incident report" fill="#1890FF" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReportChart;
