import Shift from 'models/shift.model';

export default interface DashboardShift
  extends Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime' | 'status'> {
  numOfTotalExamRooms: number;
  numOfTotalReports: number;
  numOfNotReadyExamRooms: number;
  numOfTotalLockedAttendances: number;
  numOfAbsent: number;
}
