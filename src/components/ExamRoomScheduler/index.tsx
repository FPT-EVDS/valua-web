/* eslint-disable react/require-default-props */
import 'devextreme/dist/css/dx.light.css';
import './index.scss';

import { format } from 'date-fns';
import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler';
import React from 'react';

import Appointment from './Appoinment';
import AppointmentTooltip from './AppoinmentTooltip';
import { daysOfWeek, mockData } from './data';

interface Props {
  height?: number;
}

const ExamRoomScheduler = ({ height = 550 }: Props) => {
  const groups = ['day'];
  return (
    <Scheduler
      dataSource={mockData}
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
