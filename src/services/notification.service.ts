import SearchParams from 'dtos/searchParams.dto';

import axiosClient from './axiosClient';

const notificationServices = {
  getNotifications: (payload?: SearchParams) => {
    const url = `/notifications`;
    return axiosClient.get(url, { params: { ...payload } });
  },
  getUnreadNotifications: () => {
    const url = '/notifications/unread';
    return axiosClient.get(url);
  },
};

export default notificationServices;
