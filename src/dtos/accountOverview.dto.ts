export default interface AccountOverviewDto {
  totalAccount: number;
  totalExaminee: number;
  totalEmbedded: number;
  totalStaff: number;
  totalShiftManager: number;
  accountsPerSemester: {
    [key: string]: number;
  };
}
