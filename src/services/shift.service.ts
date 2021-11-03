import { AxiosResponse } from 'axios';
import DisableShiftDto from 'dtos/disableShift.dto';
import SearchShiftParamsDto from 'dtos/searchShiftParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Shift from 'models/shift.model';

import axiosClient from './axiosClient';

const shiftServices = {
  getShifts: ({
    page,
    sort,
    semesterId,
    date,
  }: SearchShiftParamsDto): Promise<AxiosResponse<ShiftsDto>> => {
    const url = `/shifts`;
    return axiosClient.get(url, {
      params: { page, sort, semester: semesterId, date },
    });
  },
  getShift: (id: string): Promise<AxiosResponse<Shift>> => {
    const url = `/shifts/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addShift: (payload: ShiftDto): Promise<AxiosResponse<Shift>> => {
    const url = '/shifts';
    return axiosClient.post(url, payload);
  },
  updateShift: (payload: ShiftDto): Promise<AxiosResponse<Shift>> => {
    const url = `/shifts/${String(payload.shiftId)}`;
    return axiosClient.put(url, payload);
  },
  disableShift: (id: string): Promise<AxiosResponse<DisableShiftDto>> => {
    const url = `/shifts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 0,
      },
    ]);
  },
  getShiftCalendar: (
    id: string,
  ): Promise<AxiosResponse<Record<string, number>>> => {
    const url = `/shifts/calendar/${id}`;
    return axiosClient.get(url);
  },
};

export default shiftServices;
