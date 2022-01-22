import { Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React from 'react';
import { formatTime } from 'utils';

import { AppoinmentData } from '../data';

interface AppoinmentProps {
  data: {
    appointmentData: AppoinmentData;
  };
}

const AppointmentTooltip = ({ data: { appointmentData } }: AppoinmentProps) => {
  const { startDate, endDate, totalExamRooms, totalReports } = appointmentData;
  return (
    <Stack padding={1.5}>
      <Typography variant="h6" textAlign="left">
        Time: {formatTime(startDate)} - {formatTime(endDate)}
      </Typography>
      <Typography color="textSecondary" textAlign="left" variant="subtitle2">
        Total exam rooms: {totalExamRooms}
      </Typography>
      <Typography color="textSecondary" textAlign="left" variant="subtitle2">
        Total reports: {totalReports}
      </Typography>
      <Typography color="textSecondary" textAlign="left" variant="subtitle2">
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
        | Absent:
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
      </Typography>
    </Stack>
  );
};

export default AppointmentTooltip;
