import { AxiosResponse } from 'axios';
import DisableShiftDto from 'dtos/disableShift.dto';
import LockedShiftsDto from 'dtos/lockedShifts.dto';
import ReadyShiftsDto from 'dtos/readyShifts.dto';
import SearchShiftParamsDto from 'dtos/searchShiftParams.dto';
import ShiftDto from 'dtos/shift.dto';
import ShiftDashboardDto from 'dtos/shiftDashboard.dto';
import ShiftOverviewParams from 'dtos/shiftOverviewParams.dto';
import ShiftsDto from 'dtos/shifts.dto';
import StaffingShiftsDto from 'dtos/staffingShifts.dto';
import Shift from 'models/shift.model';

import axiosClient from './axiosClient';

const shiftServices = {
  getShifts: (
    params: SearchShiftParamsDto,
  ): Promise<AxiosResponse<ShiftsDto>> => {
    const url = `/shifts`;
    return axiosClient.get(url, {
      params: { ...params },
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
    return axiosClient.patch(url, {}, { params: { opt: 'remove' } });
  },
  getShiftCalendar: (
    id: string,
  ): Promise<AxiosResponse<Record<string, number>>> => {
    const url = `/shifts/calendar/${id}`;
    return axiosClient.get(url);
  },
  getShiftOverview: (
    params?: ShiftOverviewParams,
  ): Promise<AxiosResponse<ShiftDashboardDto>> => {
    const url = '/shifts/overview';
    return axiosClient.get(url, { params: { ...params } });
  },
  startStaffing: (
    payload: Pick<Shift, 'shiftId'>[],
  ): Promise<AxiosResponse<Array<Shift>>> => {
    const url = '/shifts/staffing';
    return axiosClient.post(url, payload);
  },
  lockShifts: (
    payload: Pick<Shift, 'shiftId'>[],
  ): Promise<AxiosResponse<LockedShiftsDto>> => {
    const url = '/shifts/lock';
    return axiosClient.post(url, payload);
  },
  getShiftsForStaffing: (): Promise<AxiosResponse<StaffingShiftsDto>> => {
    const url = '/shifts/staffing';
    return axiosClient.get(url);
  },
  getShiftsToLock: (): Promise<AxiosResponse<ReadyShiftsDto>> => {
    const url = '/shifts/lock';
    return axiosClient.get(url);
  },
};

export default shiftServices;
