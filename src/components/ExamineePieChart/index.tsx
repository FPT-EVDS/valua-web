/* eslint-disable react/require-default-props */
import { Box } from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import React, { useState } from 'react';
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
  XAxis,
} from 'recharts';

export interface ExamineePieChartProps {
  totalRemoved: number;
  totalAssigned: number;
  totalUnassigned: number;
}

interface XAxisTickProps {
  x: number;
  y: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}

interface ChartDataProps {
  name: string;
  value: number;
}

const ExamineePieChart = ({
  totalRemoved,
  totalAssigned,
  totalUnassigned,
}: ExamineePieChartProps) => {
  const totalExaminees = totalRemoved + totalAssigned + totalUnassigned;
  const [animation, setAnimation] = useState(true);
  const chartData: ChartDataProps[] = [
    { name: 'Assigned', value: totalAssigned },
    { name: 'Unassigned', value: totalUnassigned },
    { name: 'Removed', value: totalRemoved },
  ];

  const renderCustomizedLabel = ({
    x,
    y,
    cx,
    fill,
    payload,
  }: PieLabelRenderProps) => {
    if (payload.value > 0)
      return (
        <text
          x={x}
          y={y}
          fill={fill}
          textAnchor={cx && x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          {payload.value}
        </text>
      );
    return null;
  };

  const CustomizedAxisTick = (tickProps: XAxisTickProps) => {
    const { x, y, payload } = tickProps;

    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={16} textAnchor="middle" fill="#666">
          {payload.value}
        </text>
      </g>
    );
  };

  return (
    <Box sx={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            isAnimationActive={animation}
            onAnimationEnd={() => setAnimation(false)}
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={50}
            outerRadius={80}
            fill={red[700]}
            label={renderCustomizedLabel}
            legendType="square"
          >
            <XAxis dataKey="name" tick={CustomizedAxisTick} interval={0} />
            <Label value={totalExaminees} position="center" fontSize={24} />
            <Cell fill={green[700]} />
            <Cell fill={orange[400]} />
            <Cell fill={red[500]} />
          </Pie>
          <Legend
            iconSize={9}
            wrapperStyle={{
              paddingTop: '10px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ExamineePieChart;
