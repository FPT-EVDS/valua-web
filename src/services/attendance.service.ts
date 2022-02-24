import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';

const attendanceServices = {
  downloadAttendances: (shiftId: string): Promise<AxiosResponse> => {
    const url = `/attendances/download/${shiftId}`;
    return axiosClient.get(url, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  },
};

export default attendanceServices;
