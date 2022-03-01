import Shift from 'models/shift.model';

export default interface StaffingShiftsDto {
  shiftsToStart: Array<
    Pick<Shift, 'shiftId' | 'beginTime' | 'finishTime' | 'status'> & {
      availableSlots: number;
    }
  >;
}
