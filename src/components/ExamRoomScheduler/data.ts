export interface AppoinmentData {
  day: number;
  startDate: Date;
  endDate: Date;
  totalExamRooms: number;
  totalReports: number;
}

// const firstDayOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

// // this variable is use for show appoinment, because chart only support current day
// // so we need to convert the start and end date to current date, but different time and day
// const beginOfDate = new Date().setHours(0, 0, 0, 0);

// export const daysOfWeek = [...Array.from({ length: 7 })].map((value, index) => {
//   const dayOfWeek = add(firstDayOfWeek, { days: index });
//   return {
//     id: dayOfWeek.getDate(),
//     text: format(dayOfWeek, 'eeee (dd/MM)'),
//     color: dayOfWeekColors[index],
//   };
// });

// export const mockData: AppoinmentData[] = [...Array.from({ length: 7 })].map(
//   (value, index) => {
//     const randomStartTime = Math.floor(Math.random() * 6) + 6;
//     const randomDuration = Math.floor(Math.random() * 6);
//     const randomMinute = Math.floor(Math.random() * 60);
//     return {
//       day: add(firstDayOfWeek, { days: index }).getDate(),
//       text: 'Tooltip text',
//       startDate: add(beginOfDate, { hours: randomStartTime }),
//       endDate: add(beginOfDate, {
//         hours: randomStartTime + randomDuration + 1,
//         minutes: randomMinute,
//       }),
//       totalExamRooms: randomDuration,
//       totalReports: randomMinute,
//     };
//   },
// );
