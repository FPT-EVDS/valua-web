import Status from 'enums/status.enum';

const ActiveStatus = [
  {
    value: Status.isActive,
    label: 'Active',
  },
  {
    value: Status.isDisable,
    label: 'Inactive',
  },
];

export default ActiveStatus;
