import ShiftStatus from 'enums/shiftStatus.enum';

export interface AppoinmentData {
  shiftId: string | null;
  day: number;
  date: Date;
  startDate: Date;
  endDate: Date;
  totalExamRooms: number;
  totalReports: number;
  totalAttendances: number;
  status: ShiftStatus;
  totalAbsences: number;
}
