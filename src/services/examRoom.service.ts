import { AxiosResponse } from 'axios';
import ExamRoomsDto from 'dtos/examRooms.dto';
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
};

export default examRoomServices;
