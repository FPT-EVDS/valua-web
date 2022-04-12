export default interface Config {
  [key: string]: number;
}

export interface ShiftManagerConfig extends Config {
  hoursOfMaxDuration: number;
  minutesBeforeForceFinish: number;
  hoursToSendLockShiftWarningBeforeStart: number;
  hoursBeforeShiftStarts: number;
  minutesOfMinDuration: number;
}
