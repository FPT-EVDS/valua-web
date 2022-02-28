import Shift from 'models/shift.model';

export default interface LockedShiftsDto {
  numOfLockedShift: number;
  lockedShifts: Shift[];
}
