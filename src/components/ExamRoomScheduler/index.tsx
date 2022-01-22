/* eslint-disable react/require-default-props */
import 'devextreme/dist/css/dx.light.css';
import './index.scss';

import Scheduler, { Resource, Scrolling } from 'devextreme-react/scheduler';
import React from 'react';

import Appointment from './Appoinment';
import AppointmentTooltip from './AppoinmentTooltip';
import { daysOfWeek, mockData } from './data';

interface Props {
  height?: number;
}

const ExamRoomScheduler = ({ height = 650 }: Props) => {
  const groups = ['day'];
  return (
    <Scheduler
      dataSource={mockData}
      defaultCurrentView="timelineDay"
      groups={groups}
      editing={false}
      height={height}
      firstDayOfWeek={1}
      startDayHour={0}
      maxAppointmentsPerCell={1}
      endDayHour={24}
      onAppointmentDblClick={e => {
        e.cancel = true;
      }}
      onAppointmentFormOpening={e => {
        e.cancel = true;
      }}
      appointmentTooltipComponent={AppointmentTooltip}
      appointmentComponent={Appointment}
      showAllDayPanel={false}
      crossScrollingEnabled
      cellDuration={60}
    >
      <Resource dataSource={daysOfWeek} fieldExpr="day" useColorAsDefault />
      <Scrolling mode="virtual" />
    </Scheduler>
  );
};

export default ExamRoomScheduler;
