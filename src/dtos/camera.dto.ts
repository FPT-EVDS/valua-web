import Room from 'models/room.model';

interface CameraDto {
  cameraId: string;
  cameraName: string;
  configurationUrl: string;
  lastModifiedDate: Date;
  purchaseDate: Date;
  createdDate: Date;
  room: Room | null;
  status: number;
  description: string;
}

export default CameraDto;
