import { AxiosResponse } from 'axios';
import DisableShiftDto from 'dtos/disableShift.dto';
import SearchParams from 'dtos/searchParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftsDto from 'dtos/shifts.dto';
import Shift from 'models/shift.model';

import axiosClient from './axiosClient';

const shiftServices = {
  getShifts: ({
    page,
    sort,
  }: SearchParams): Promise<AxiosResponse<ShiftsDto>> => {
    const url = `/shifts`;
    return axiosClient.get(url, { params: { page, sort } });
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
};

export default shiftServices;
