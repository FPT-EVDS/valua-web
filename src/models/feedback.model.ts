import Room from 'models/room.model';
import User from 'models/user.model';
import Violation from 'models/violation.model';

type Feedback = {
  feedbackId: string;
  examinee: User | null;
  shiftManager: User | null;
  violation: Violation | null;
  lastModifiedDate: Date;
  createdDate: Date;
  room: Room | null;
  status: number;
  content: string;
};

export default Feedback;
