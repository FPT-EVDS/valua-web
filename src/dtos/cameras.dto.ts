import Camera from 'models/camera.model';

import PagingDto from './paging.dto';

interface CamerasDto extends PagingDto {
  cameras: Array<Camera>;
}

export default CamerasDto;
