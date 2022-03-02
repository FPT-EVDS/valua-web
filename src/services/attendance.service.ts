import { AxiosResponse } from 'axios';
import AddAttendanceDto from 'dtos/addAttendance.dto';
import Attendance from 'models/attendance.model';

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
  addAttendance: (
    payload: AddAttendanceDto,
  ): Promise<AxiosResponse<Attendance>> => {
    const url = '/attendances';
    return axiosClient.post(url, payload);
  },
  removeAttendance: (
    attendanceId: string,
  ): Promise<AxiosResponse<Attendance>> => {
    const url = `/attendances/${String(attendanceId)}`;
    return axiosClient.patch(url);
  },
};

export default attendanceServices;
