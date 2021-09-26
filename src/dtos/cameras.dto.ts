import Camera from 'models/camera.model';

import PagingDto from './paging.dto';

interface CameraDto extends PagingDto {
  cameras: Array<Camera>;
}

export default CameraDto;
