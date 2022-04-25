/* eslint-disable react/require-default-props */
import 'devextreme/dist/css/dx.light.css';
import './index.scss';

import { FiberManualRecord } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import ShiftConfig from 'configs/constants/shiftConfig.status';
import { add, format, isSameDay, startOfWeek } from 'date-fns';
import { CellClickEvent } from 'devextreme/ui/scheduler';
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler';
import DashboardShift from 'dtos/dashboardShift.dto';
import ShiftStatus from 'enums/shiftStatus.enum';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Appointment from './Appoinment';
import AppointmentTooltip from './AppoinmentTooltip';
import { AppoinmentData } from './data';

interface Props {
  height?: number;
  shifts: DashboardShift[] | null;
  onCellClick?: string | ((e: CellClickEvent) => void) | undefined;
}

interface ResourceProps {
  id: string;
  text: string;
}

const ExamRoomScheduler = ({ height = 1200, shifts, onCellClick }: Props) => {
  const history = useHistory();
  const groups = ['day'];
  // "2022/02/07 - 2022/02/13" => should convert to start and end week
  const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

  // this variable is use for show appoinment, because chart only support current day
  // so we need to convert the start and end date to current date, but different time and day
  const beginOfDate = new Date().setHours(0, 0, 0, 0);

  // Generate y-axis date of the week
  const daysOfWeek = [...Array.from({ length: 7 })].map((value, index) => {
    const dayOfWeek = add(firstDayOfWeek, { days: index });
    return {
      id: dayOfWeek.getDate(),
      text: isSameDay(dayOfWeek, new Date())
        ? `${format(dayOfWeek, 'eeee (dd/MM)')}*`
        : format(dayOfWeek, 'eeee (dd/MM)'),
    };
  });

  // Shift color based on status
  const shiftColors = ShiftConfig.map(({ color, value }) => ({
    id: value,
    color,
  }));

  const chartData: AppoinmentData[] =
    shifts !== null
      ? [...Array.from({ length: shifts.length })].map((value, index) => {
          const {
            shiftId,
            beginTime,
            finishTime,
            numOfTotalExamRooms,
            numOfTotalReports,
            numOfTotalLockedAttendances,
            status,
            numOfAbsent,
          } = shifts[index];
          const shiftBeginTime = new Date(beginTime);
          const shiftFinishTime = new Date(finishTime);
          return {
            shiftId,
            day: shiftBeginTime.getDate(),
            date: shiftBeginTime,
            startDate: add(beginOfDate, {
              hours: shiftBeginTime.getHours(),
              minutes: shiftBeginTime.getMinutes(),
            }),
            endDate: add(beginOfDate, {
              hours: shiftFinishTime.getHours(),
              minutes: shiftFinishTime.getMinutes(),
            }),
            totalExamRooms: numOfTotalExamRooms,
            totalReports: numOfTotalReports,
            totalAttendances: numOfTotalLockedAttendances,
            status,
            totalAbsences: numOfAbsent,
          };
        })
      : [];

  const renderResourceDataCell = (data: ResourceProps) => {
    const { id, text } = data;
    const isCurrentDate = parseInt(id, 10) === new Date().getDate();
    return (
      <Typography
        fontSize={14}
        fontWeight={isCurrentDate ? 700 : 600}
        color={isCurrentDate ? 'primary' : '#333333'}
      >
        {text}
      </Typography>
    );
  };

  return (
    <>
      <Scheduler
        dataSource={chartData}
        defaultCurrentView="timelineDay"
        groups={groups}
        editing={false}
        height={height}
        firstDayOfWeek={1}
        startDayHour={6}
        endDayHour={18}
        onAppointmentDblClick={e => {
          e.cancel = true;
        }}
        onAppointmentFormOpening={e => {
          e.cancel = true;
          const { shiftId } = e.appointmentData as AppoinmentData;
          if (shiftId) {
            history.push(`/shift-manager/shifts/${shiftId}`);
          }
        }}
        onCellClick={onCellClick}
        crossScrollingEnabled
        appointmentTooltipComponent={AppointmentTooltip}
        appointmentComponent={Appointment}
        showAllDayPanel={false}
        timeCellRender={data => (
          <div>{format(new Date(data.date), 'HH:mm')}</div>
        )}
        resourceCellRender={renderResourceDataCell}
        cellDuration={60}
      >
        <Resource dataSource={daysOfWeek} fieldExpr="day" />
        <Resource
          dataSource={shiftColors}
          fieldExpr="status"
          useColorAsDefault
        />
        <Scrolling mode="virtual" />
      </Scheduler>
      {/* Legend */}
      <Box
        mt={2}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          columnGap: '20px',
        }}
      >
        {ShiftConfig.map(
          (config, index) =>
            index !== ShiftConfig.length - 1 &&
            config.value !== ShiftStatus.Removed && (
              <Stack
                key={config.value}
                direction="row"
                spacing={0.5}
                alignItems="center"
              >
                <FiberManualRecord
                  fontSize="small"
                  sx={{ color: config?.color }}
                />
                <Typography
                  variant="caption"
                  fontSize={14}
                  color={config.color}
                  fontWeight="bold"
                >
                  {config.label}
                </Typography>
              </Stack>
            ),
        )}
      </Box>
    </>
  );
};

export default ExamRoomScheduler;
