import Status from 'enums/status.enum';

export default interface Shift {
  shiftId: string | null;
  shiftManager: {
    appUserId: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    imageUrl: string;
    companyId: string;
  };
  semester: {
    semesterId: string;
    semesterName: string;
  };
  beginTime: Date;
  finishTime: Date;
  description: string;
  status: Status;
  createdDate: Date;
  lastModifiedDate: Date;
}
