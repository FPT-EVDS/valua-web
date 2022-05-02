/* eslint-disable react/require-default-props */
import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  CurrentTimeIndicator,
  DateNavigator,
  Scheduler,
  TodayButton,
  Toolbar,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import { AccessTimeOutlined, FiberManualRecord } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import ShiftConfig from 'configs/constants/shiftConfig.status';
import { format } from 'date-fns';
import DashboardShift from 'dtos/dashboardShift.dto';
import React, { useEffect, useState } from 'react';
import { formatTime } from 'utils';

type Props = {
  currentDate: Date;
  shifts?: DashboardShift[] | null;
  isLoading?: boolean;
  handleCellDoubleClick?: (props: WeekView.TimeTableCellProps) => void;
  handleCurrentDateChange?: (curentDate: Date) => void;
};

const Appointment = ({
  children,
  style,
  data,
  ...restProps
}: Appointments.AppointmentProps & {
  [x: string]: any;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}) => {
  const { status, title, startDate, endDate } = data;
  const backgroundColor = ShiftConfig.find(
    config => config.value === status,
  )?.color;
  return (
    <Appointments.Appointment
      data={data}
      {...restProps}
      style={{
        ...style,
        backgroundColor,
        borderRadius: '8px',
      }}
    >
      <Stack ml={1}>
        <Typography color="#fff" fontWeight={500} fontSize={13} marginTop={0.5}>
          {title}
        </Typography>
        <Typography color="#fff" fontSize={12}>
          {formatTime(new Date(startDate))} - {formatTime(new Date(endDate))}
        </Typography>
      </Stack>
    </Appointments.Appointment>
  );
};

const Content = ({
  children,
  appointmentData,
  ...restProps
}: AppointmentTooltip.ContentProps & {
  [x: string]: any;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
}) => {
  if (appointmentData) {
    const { title, startDate, endDate, status } = appointmentData;
    const shiftConfig = ShiftConfig.find(config => config.value === status);
    return (
      <Stack ml={1} padding={1} spacing={1}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <FiberManualRecord
            fontSize="large"
            sx={{ color: shiftConfig?.color }}
          />
          <Stack>
            <Typography
              variant="caption"
              fontSize={18}
              color={shiftConfig?.color}
              fontWeight="bold"
            >
              {title}
            </Typography>
            <Typography variant="caption" color="textSecondary" fontSize={15}>
              {format(new Date(startDate), 'PPPP')}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2.5} alignItems="center" pl={0.8}>
          <AccessTimeOutlined sx={{ color: '#333333' }} />
          <Typography
            color="textSecondary"
            textAlign="left"
            variant="subtitle2"
          >
            {formatTime(new Date(startDate))} - {formatTime(new Date(endDate))}
          </Typography>
        </Stack>
      </Stack>
    );
  }
  return (
    <AppointmentTooltip.Content
      {...restProps}
      appointmentData={appointmentData}
    />
  );
};

const ShiftScheduler = ({
  shifts,
  currentDate,
  isLoading = false,
  handleCellDoubleClick,
  handleCurrentDateChange,
}: Props) => {
  const [appointments, setAppointments] = useState<AppointmentModel[]>([]);

  useEffect(() => {
    const newAppointments = shifts
      ? shifts.map(shift => ({
          title: ShiftConfig.find(config => config.value === shift.status)
            ?.label,
          startDate: new Date(shift.beginTime),
          endDate: new Date(shift.finishTime),
          id: String(shift.shiftId),
          status: shift.status,
        }))
      : [];
    setAppointments(newAppointments);
  }, [shifts]);

  return (
    <>
      <Scheduler data={appointments} firstDayOfWeek={0}>
        <ViewState
          currentDate={currentDate}
          onCurrentDateChange={handleCurrentDateChange}
        />
        <WeekView
          startDayHour={6}
          endDayHour={23}
          cellDuration={60}
          timeTableCellComponent={props => (
            <WeekView.TimeTableCell
              {...props}
              onDoubleClick={() => {
                if (handleCellDoubleClick) handleCellDoubleClick(props);
              }}
            />
          )}
        />
        <Appointments appointmentComponent={Appointment} />
        <AppointmentTooltip contentComponent={Content} />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <CurrentTimeIndicator
          shadePreviousCells
          shadePreviousAppointments
          // Remove indicator
          indicatorComponent={() => <div />}
        />
      </Scheduler>
    </>
  );
};

export default ShiftScheduler;
