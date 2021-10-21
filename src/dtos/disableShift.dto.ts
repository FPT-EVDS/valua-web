import Status from 'enums/status.enum';

export default interface DisableShiftDto {
  shiftId: string;
  status: Status;
}
