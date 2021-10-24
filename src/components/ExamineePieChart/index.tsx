/* eslint-disable react/require-default-props */
import { green, red } from '@mui/material/colors';
import React from 'react';
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  totalExaminees: number;
  totalUnassigned: number;
}

const ExamineePieChart = ({ totalExaminees, totalUnassigned }: Props) => {
  const data = [
    { name: 'Assigned', value: totalExaminees - totalUnassigned },
    { name: 'Unassigned', value: totalExaminees },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          fill={red[700]}
          label
          legendType="square"
        >
          <Label value={totalExaminees} position="center" fontSize={24} />
          <Cell fill={green[700]} />
        </Pie>
        <Legend
          iconSize={9}
          wrapperStyle={{
            paddingTop: '10px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExamineePieChart;
