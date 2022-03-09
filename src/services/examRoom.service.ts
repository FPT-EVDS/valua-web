import { AxiosResponse } from 'axios';
import AssignStaffToExamRoomDto from 'dtos/assignStaffToExamRoom.dto';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import AvailableRoomsDto from 'dtos/availableRooms.dto';
import AvailableStaffDto from 'dtos/availableStaff.dto';
import CreateExamRoomDto from 'dtos/createExamRoom.dto';
import DisableExamRoom from 'dtos/disableExamRoom.dto';
import ExamRoomsDto from 'dtos/examRooms.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import SearchExamRoomsDto from 'dtos/searchExamRooms.dto';
import UpdateExamRoomDto from 'dtos/updateExamRoom.dto';
import DetailExamRoom from 'models/detailExamRoom.model';
import ExamRoom from 'models/examRoom.model';

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
  getExamRoomDetail: (
    examRoomId: string,
  ): Promise<AxiosResponse<DetailExamRoom>> => {
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
  getAvailableStaff: (
    shiftId: string,
  ): Promise<AxiosResponse<AvailableStaffDto>> => {
    const url = '/examRooms/available/staff';
    return axiosClient.post(url, { shiftId });
  },
  createExamRoom: (
    payload: CreateExamRoomDto[],
  ): Promise<AxiosResponse<ExamRoom>> => {
    const url = '/examRooms';
    return axiosClient.post(url, payload);
  },
  assignStaff: ({
    examRoomId,
    staffId,
  }: AssignStaffToExamRoomDto): Promise<AxiosResponse<ExamRoom>> => {
    const url = `/examRooms/staff/${examRoomId}`;
    return axiosClient.post(url, { staffId });
  },
  updateExamRoom: ({
    examRoomId,
    room,
    staff,
    subject,
  }: UpdateExamRoomDto): Promise<AxiosResponse<DetailExamRoom>> => {
    const url = `/examRooms/${examRoomId}`;
    return axiosClient.put(url, {
      staff: {
        appUserId: staff.appUserId,
      },
      room: {
        roomId: room.roomId,
      },
      subject: {
        subjectId: subject.subjectId,
      },
    });
  },
  deleteExamRoom: (
    examRoomId: string,
  ): Promise<AxiosResponse<DisableExamRoom>> => {
    const url = `/examRooms/${examRoomId}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 0,
      },
    ]);
  },
};

export default examRoomServices;
