import { AxiosResponse } from 'axios';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import AvailableRoomsDto from 'dtos/availableRooms.dto';
import ExamRoomsDto from 'dtos/examRooms.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import SearchExamRoomsDto from 'dtos/searchExamRooms.dto';
import Shift from 'models/shift.model';
import axiosClient from './axiosClient';

const examRoomServices = {
  getListExamRooms: ({
    shiftId,
    page,
    search,
    sort,
  }: SearchExamRoomsDto): Promise<AxiosResponse<ExamRoomsDto>> => {
    const url = `/examRooms/shift/${shiftId}`;
    return axiosClient.get(url, {
      params: { page, sort, search },
    });
  },
  getExamRoomDetail: (examRoomId: string): Promise<AxiosResponse<Shift>> => {
    const url = `/examRooms/${examRoomId}`;
    return axiosClient.get(url);
  },
  getAvailableExamRooms: (
    payload: GetAvailableExamRoomsDto,
  ): Promise<AxiosResponse<AvailableRoomsDto>> => {
    const url = '/examRooms/available/room';
    return axiosClient.post(url, payload);
  },
  getAvailableExaminees: (
    payload: GetAvailableExamineesDto,
  ): Promise<AxiosResponse<AvailableExamineesDto>> => {
    const url = '/examRooms/available/subject';
    return axiosClient.post(url, payload);
  },
  getAvailableStaff: (shiftId: string) => {
    const url = '/examRooms/available/staff';
    return axiosClient.post(url, { shiftId });
  },
};

export default examRoomServices;
