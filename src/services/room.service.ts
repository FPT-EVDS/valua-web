import { AxiosResponse } from 'axios';
import DisableRoomDto from 'dtos/disableRoom.dto';
import RoomDto from 'dtos/room.dto';
import RoomsDto from 'dtos/rooms.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
import Room from 'models/room.model';

import axiosClient from './axiosClient';

const roomServices = {
  getRooms: (numOfPage: number): Promise<AxiosResponse<RoomsDto>> => {
    const url = `/rooms`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getRoom: (id: string): Promise<AxiosResponse<{ room: Room }>> => {
    const url = `/rooms/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addRoom: (payload: RoomDto): Promise<AxiosResponse<Room>> => {
    const url = '/rooms';
    return axiosClient.post(url, payload);
  },
  updateRoom: (payload: RoomDto): Promise<AxiosResponse<Room>> => {
    const url = `/rooms/${String(payload.roomId)}`;
    return axiosClient.put(url, payload);
  },
  disableRoom: (id: string): Promise<AxiosResponse<DisableRoomDto>> => {
    const url = `/rooms/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 0,
      },
    ]);
  },
  getRoomsForShift: (): Promise<AxiosResponse<Room[]>> => {
    const url = '/rooms/shiftManager/roomReady';
    return axiosClient.get(url);
  },
  searchRoomsByName: ({
    page,
    search,
    sort,
    status,
  }: SearchByNameDto): Promise<AxiosResponse<RoomsDto>> => {
    const url = `/rooms`;
    return axiosClient.get(url, {
      params: {
        page,
        search,
        status,
        sort,
      },
    });
  },
};

export default roomServices;
