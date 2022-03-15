import NotificationStatus from 'enums/notificationStatus.enum';

type Notification = {
  content: string;
  createdDate: Date;
  header: string;
  isRead: boolean;
  notificationId: string;
  route: string;
  topic: string;
  type: NotificationStatus;
};

export default Notification;
