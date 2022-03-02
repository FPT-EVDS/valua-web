import {
  blue,
  green,
  grey,
  indigo,
  orange,
  pink,
  red,
} from '@mui/material/colors';
import ShiftStatus from 'enums/shiftStatus.enum';

const ShiftConfig = [
  {
    value: ShiftStatus.Removed,
    label: 'Removed',
    color: red[500],
  },
  {
    value: ShiftStatus.Finished,
    label: 'Finished',
    color: indigo[500],
  },
  {
    value: ShiftStatus.NotReady,
    label: 'Not ready',
    color: orange[400],
  },
  {
    value: ShiftStatus.Ready,
    label: 'Ready',
    color: green[500],
  },
  {
    value: ShiftStatus.Locked,
    label: 'Locked',
    color: grey[500],
  },
  {
    value: ShiftStatus.Ongoing,
    label: 'Ongoing',
    color: blue[500],
  },
  {
    value: ShiftStatus.Staffing,
    label: 'Staffing',
    color: pink[500],
  },
  {
    value: -1,
    label: 'Unknown',
    color: '#000',
  },
];

const notAllowEditShiftStatuses = new Set([
  ShiftStatus.Ongoing,
  ShiftStatus.Locked,
  ShiftStatus.Removed,
  ShiftStatus.Finished,
  ShiftStatus.Staffing,
]);

const notAllowedEditExamRoomStatuses = new Set([
  ShiftStatus.Ongoing,
  ShiftStatus.Locked,
  ShiftStatus.Removed,
  ShiftStatus.Finished,
  ShiftStatus.Staffing,
]);

export default ShiftConfig;

export { notAllowedEditExamRoomStatuses, notAllowEditShiftStatuses };
