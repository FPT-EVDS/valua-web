import Shift from 'models/shift.model';

export default interface ReadyShiftsDto {
  readyShifts: Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime' | 'status'>[];
  numOfReadyShifts: number;
}
