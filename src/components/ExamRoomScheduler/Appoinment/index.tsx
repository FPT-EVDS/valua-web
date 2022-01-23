import { Typography } from '@mui/material';
import React from 'react';
import { formatTime } from 'utils';

import { mockData } from '../data';

interface AppoinmentProps {
  index: number;
}

const Appointment = ({ index }: AppoinmentProps) => {
  const { startDate, endDate, totalExamRooms } = mockData[index];
  return (
    <>
      <Typography fontSize={13} fontWeight="bold" gutterBottom={false}>
        {formatTime(startDate)} - {formatTime(endDate)}
      </Typography>
      <Typography fontSize={11}>Total exam rooms: {totalExamRooms}</Typography>
    </>
  );
};

export default Appointment;
