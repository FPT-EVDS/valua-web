export default interface Config {
  [key: string]: unknown;
}

export interface ShiftManagerConfig extends Config {
  hoursOfMaxDuration: number;
  minutesBeforeForceFinish: number;
  hoursToSendLockShiftWarningBeforeStart: number;
  hoursBeforeShiftStarts: number;
  minutesOfMinDuration: number;
  maxSlotPerExaminee: number;
  minutesPerSlot: number;
  minutesBetweenShifts: number;
  start: number;
  end: number;
}

export interface ManagerConfig extends Config {
  roomConfig: {
    floor: {
      [key: number]: string;
    };
  };
  examRoomConfig: {
    reservedStaffCode: string;
  };
  aiConfig: {
    AIThreshold: number;
  };
}
