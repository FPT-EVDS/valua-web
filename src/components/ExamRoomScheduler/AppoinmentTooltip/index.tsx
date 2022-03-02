import {
  AssignmentOutlined,
  FiberManualRecord,
  GroupsOutlined,
  LocationOnOutlined,
  NoAccountsOutlined,
} from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import ShiftConfig from 'configs/constants/shiftConfig.status';
import { format } from 'date-fns';
import ShiftStatus from 'enums/shiftStatus.enum';
import React from 'react';
import { formatTime } from 'utils';

import { AppoinmentData } from '../data';

interface AppoinmentProps {
  data: {
    appointmentData: AppoinmentData;
  };
}

const AppointmentTooltip = ({ data: { appointmentData } }: AppoinmentProps) => {
  const {
    date,
    startDate,
    endDate,
    totalExamRooms,
    totalReports,
    totalAttendances,
    totalAbsences,
    status,
  } = appointmentData;
  const shiftStatus =
    ShiftConfig.find(config => config.value === status) ??
    ShiftConfig[ShiftConfig.length - 1];
  return (
    <Stack padding={1.5} spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" textAlign="left" fontSize={18}>
          Time: {format(date, 'dd/MM')} {formatTime(startDate)} -{' '}
          {formatTime(endDate)}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography
            variant="caption"
            fontSize={14}
            color={shiftStatus.color}
            fontWeight="bold"
          >
            {shiftStatus?.label}
          </Typography>
          <FiberManualRecord
            fontSize="small"
            sx={{ color: shiftStatus?.color }}
          />
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <LocationOnOutlined fontSize="small" />
        <Typography color="textSecondary" textAlign="left" variant="subtitle2">
          Exam rooms: {totalExamRooms}
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <GroupsOutlined fontSize="small" />
        <Typography color="textSecondary" textAlign="left" variant="subtitle2">
          Attendances: {totalAttendances}
        </Typography>
      </Stack>
      {status === ShiftStatus.Finished && (
        <>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AssignmentOutlined fontSize="small" />
            <Typography
              color="textSecondary"
              textAlign="left"
              variant="subtitle2"
            >
              Reports: {totalReports}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <NoAccountsOutlined fontSize="small" />
            <Typography
              color="textSecondary"
              textAlign="left"
              variant="subtitle2"
            >
              Absences: {totalAbsences}
            </Typography>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default AppointmentTooltip;
