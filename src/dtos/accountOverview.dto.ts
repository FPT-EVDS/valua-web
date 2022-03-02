export default interface AccountOverview {
  totalAccount: number;
  totalExaminee: number;
  totalStaff: number;
  totalShiftManager: number;
  accountsPerSemester: {
    [key: string]: number;
  };
}
