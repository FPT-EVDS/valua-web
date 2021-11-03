import ShiftStatus from 'enums/shiftStatus.enum';

export default interface DisableShiftDto {
  shiftId: string;
  status: ShiftStatus;
}
