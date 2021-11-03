import Evidence from 'models/evidence.model';
import ExamRoom from 'models/examRoom.model';
import User from 'models/user.model';

type Violation = {
  violationId: string;
  description: string;
  configurationUrl: string;
  lastModifiedDate: Date;
  createdDate: Date;
  status: number;
  examRoom: ExamRoom | null;
  evidence: Evidence ;
  violator: User | null;
};

export default Violation;
