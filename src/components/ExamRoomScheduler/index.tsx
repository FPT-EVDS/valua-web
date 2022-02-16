/* eslint-disable react/require-default-props */
import 'devextreme/dist/css/dx.light.css';
import './index.scss';

import ShiftConfig from 'configs/constants/shiftConfig.status';
import { add, format, startOfWeek } from 'date-fns';
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler';
import DashboardShift from 'dtos/dashboardShift.dto';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Appointment from './Appoinment';
import AppointmentTooltip from './AppoinmentTooltip';
import { AppoinmentData } from './data';

interface Props {
  height?: number;
  shifts: DashboardShift[];
}

const ExamRoomScheduler = ({ height = 550, shifts }: Props) => {
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
      text: format(dayOfWeek, 'eeee (dd/MM)'),
    };
  });

  // Shift color based on status
  const shiftColors = ShiftConfig.map(({ color, value }) => ({
    id: value,
    color,
  }));

  const chartData: AppoinmentData[] = [
    ...Array.from({ length: shifts.length }),
  ].map((value, index) => {
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
        const { shiftId } = e.appointmentData as AppoinmentData;
        if (shiftId) {
          history.push(`/shift-manager/shift/${shiftId}`);
        }
      }}
      crossScrollingEnabled
      appointmentTooltipComponent={AppointmentTooltip}
      appointmentComponent={Appointment}
      showAllDayPanel={false}
      timeCellRender={data => <div>{format(new Date(data.date), 'HH:mm')}</div>}
      cellDuration={60}
    >
      <Resource dataSource={daysOfWeek} fieldExpr="day" />
      <Resource dataSource={shiftColors} fieldExpr="status" useColorAsDefault />
      <Scrolling mode="virtual" />
    </Scheduler>
  );
};

export default ExamRoomScheduler;
