/* eslint-disable react/require-default-props */
import 'devextreme/dist/css/dx.light.css';
import './index.scss';

import {
  green,
  indigo,
  lightBlue,
  orange,
  pink,
  purple,
  red,
} from '@mui/material/colors';
import { add, format, startOfWeek } from 'date-fns';
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler';
import Shift from 'models/shift.model';
import React from 'react';

import Appointment from './Appoinment';
import AppointmentTooltip from './AppoinmentTooltip';
import { AppoinmentData } from './data';

interface Props {
  height?: number;
  shifts: Array<Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime' | 'status'>>;
}

const dayOfWeekColors = [
  indigo[500],
  pink[500],
  green[500],
  orange[500],
  lightBlue[500],
  purple[500],
  red[500],
];

const ExamRoomScheduler = ({ height = 550, shifts }: Props) => {
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
      text: format(dayOfWeek, 'eeee (dd/MM)'),
      color: dayOfWeekColors[index],
    };
  });

  // FIXME: fix report and total exam room data
  const chartData: AppoinmentData[] = [
    ...Array.from({ length: shifts.length }),
  ].map((value, index) => {
    const { beginTime, finishTime } = shifts[index];
    const shiftBeginTime = new Date(beginTime);
    const shiftFinishTime = new Date(finishTime);
    return {
      day: shiftBeginTime.getDate(),
      startDate: add(beginOfDate, {
        hours: shiftBeginTime.getHours(),
        minutes: shiftBeginTime.getMinutes(),
      }),
      endDate: add(beginOfDate, {
        hours: shiftFinishTime.getHours(),
        minutes: shiftFinishTime.getMinutes(),
      }),
      totalExamRooms: Math.floor(Math.random() * 10),
      totalReports: Math.floor(Math.random() * 10),
    };
  });

  return (
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
      }}
      crossScrollingEnabled
      appointmentTooltipComponent={AppointmentTooltip}
      appointmentComponent={Appointment}
      showAllDayPanel={false}
      timeCellRender={data => <div>{format(new Date(data.date), 'HH:mm')}</div>}
      cellDuration={60}
    >
      <Resource dataSource={daysOfWeek} fieldExpr="day" useColorAsDefault />
      <Scrolling mode="virtual" />
    </Scheduler>
  );
};

export default ExamRoomScheduler;
