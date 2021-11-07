import Status from 'enums/status.enum';

const RoomStatus = [
  {
    value: Status.isActive,
    label: 'Active',
  },
  {
    value: Status.isReady,
    label: 'Ready',
  },
  {
    value: Status.isDisable,
    label: 'Disable',
  },
];

export default RoomStatus;
