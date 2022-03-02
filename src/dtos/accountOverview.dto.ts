export default interface AccountOverviewDto {
  totalAccount: number;
  totalExaminee: number;
  totalStaff: number;
  totalShiftManager: number;
  accountsPerSemester: {
    [key: string]: number;
  };
}
