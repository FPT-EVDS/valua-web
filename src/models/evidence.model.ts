import User from './user.model';

type Evidence = {
  evidenceId: string;
  evaluatedAt: Date;
  finishedTime: Date;
  recordedAt: Date;
  status: number;
  staff: User | null;
};

export default Evidence;
