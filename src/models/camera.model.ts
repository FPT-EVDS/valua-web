import Room from 'models/room.model';

type Camera = {
  cameraId: string;
  cameraName: string;
  configurationUrl: string;
  lastModifiedDate: Date;
  purchaseDate: Date;
  createdDate: Date;
  room: Room | null;
  status: number;
  description: string;
};

export default Camera;
