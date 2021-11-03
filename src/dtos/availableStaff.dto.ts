import Account from 'models/account.model';

export default interface AvailableStaffDto {
  availableStaffs: Account[];
  totalStaffs: number;
}
