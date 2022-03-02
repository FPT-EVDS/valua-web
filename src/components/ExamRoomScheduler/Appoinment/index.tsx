import { Typography } from '@mui/material';
import ShiftConfig from 'configs/constants/shiftConfig.status';
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
    appointmentData: { startDate, endDate, status },
  } = data;
  const shiftStatus =
    ShiftConfig.find(config => config.value === status) ??
    ShiftConfig[ShiftConfig.length - 1];
  return (
    <>
      <Typography fontSize={13} fontWeight="bold" gutterBottom={false}>
        {formatTime(startDate)} - {formatTime(endDate)}
      </Typography>
      <Typography fontSize={11}>{shiftStatus.label}</Typography>
    </>
  );
};

export default Appointment;
