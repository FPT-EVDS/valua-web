import Subject from "./subject.model";

export default interface Semester {
  semesterId: string;
  semesterName: string;
  subjects: Subject[];
  beginDate: Date;
  endDate: Date;
  isActive: boolean;
  createdDate: Date;
  lastModifiedDate: Date;
}
