import Status from 'enums/cameraStatus.enum';

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
    value: Status.isConnected,
    label: 'Connected',
  },
];

export default CameraStatus;
