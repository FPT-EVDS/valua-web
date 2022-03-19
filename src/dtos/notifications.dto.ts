import Notification from 'models/notification.model';

import PagingDto from './paging.dto';

interface NotificationsDto extends PagingDto {
  notifications: Array<Notification>;
}

export default NotificationsDto;
