import { green, grey, indigo, orange, red, teal } from '@mui/material/colors';
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
    color: teal[500],
  },
  {
    value: -1,
    label: 'Unknown',
    color: '#000',
  },
];

export default ShiftConfig;
