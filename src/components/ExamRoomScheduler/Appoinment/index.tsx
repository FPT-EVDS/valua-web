import { Typography } from '@mui/material';
import React from 'react';
import { formatTime } from 'utils';

import { AppoinmentData } from '../data';

interface AppoinmentProps {
  data: {
    appointmentData: AppoinmentData;
  };
}

const Appointment = ({ data }: AppoinmentProps) => {
  const {
    appointmentData: { startDate, endDate, totalExamRooms },
  } = data;
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
