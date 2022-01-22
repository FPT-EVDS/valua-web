import {
  green,
  indigo,
  lightBlue,
  orange,
  pink,
  purple,
  red,
} from '@mui/material/colors';
import { add, format, startOfWeek } from 'date-fns';

export const dayOfWeekColors = [
  indigo[500],
  pink[500],
  green[500],
  orange[500],
  lightBlue[500],
  purple[500],
  red[500],
];

export interface AppoinmentData {
  day: number;
  text: string;
  startDate: Date;
  endDate: Date;
  totalExamRooms: number;
  totalReports: number;
}

const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

// this variable is use for show appoinment, because chart only support current day
// so we need to convert the start and end date to current date, but different time and day
const beginOfDate = new Date().setHours(0, 0, 0, 0);

export const daysOfWeek = [...Array.from({ length: 7 })].map((value, index) => {
  const dayOfWeek = add(firstDayOfWeek, { days: index });
  return {
    id: dayOfWeek.getDate(),
    text: format(dayOfWeek, 'eeee (dd/MM)'),
    color: dayOfWeekColors[index],
  };
});

export const mockData: AppoinmentData[] = [
  {
    day: firstDayOfWeek.getDate(),
    text: 'MAE101 - Room 202',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 7 }),
    endDate: add(beginOfDate, { hours: 8 }),
  },
  {
    day: add(firstDayOfWeek, { days: 1 }).getDate(),
    text: 'JPD101 - Room 303',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 2 }),
    endDate: add(beginOfDate, { hours: 3 }),
  },
  {
    day: add(firstDayOfWeek, { days: 2 }).getDate(),
    text: 'PRJ321 - Room 022',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 0 }),
    endDate: add(beginOfDate, { hours: 1 }),
  },
  {
    day: add(firstDayOfWeek, { days: 3 }).getDate(),
    text: 'MLN101 - Room 030',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 0 }),
    endDate: add(beginOfDate, { hours: 1 }),
  },
  {
    day: add(firstDayOfWeek, { days: 4 }).getDate(),
    text: 'HCM202 - Room 404',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 14 }),
    endDate: add(beginOfDate, { hours: 18 }),
  },
  {
    day: add(firstDayOfWeek, { days: 5 }).getDate(),
    text: 'VOV101 - Room 024',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 3 }),
    endDate: add(beginOfDate, { hours: 12 }),
  },
  {
    day: add(firstDayOfWeek, { days: 6 }).getDate(),
    text: 'Random title 7',
    totalExamRooms: 20,
    totalReports: 2,
    startDate: add(beginOfDate, { hours: 7 }),
    endDate: add(beginOfDate, { hours: 9 }),
  },
];
