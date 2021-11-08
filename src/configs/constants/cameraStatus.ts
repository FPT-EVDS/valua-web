import Status from 'enums/status.enum';

const CameraStatus = [
  {
    value: Status.isActive,
    label: 'Active',
  },
  {
    value: Status.isDisable,
    label: 'Inactive',
  },
  {
    value: Status.isReady,
    label: 'Ready',
  },
];

export default CameraStatus;
