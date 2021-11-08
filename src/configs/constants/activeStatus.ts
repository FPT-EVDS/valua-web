import Status from 'enums/status.enum';

const ActiveStatus = [
  {
    value: Status.isActive,
    label: 'Active',
  },
  {
    value: Status.isDisable,
    label: 'Disable',
  },
  {
    value: Status.isReady,
    label: 'Ready',
  },
];

export default ActiveStatus;
