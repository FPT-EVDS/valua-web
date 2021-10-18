import { AxiosResponse } from 'axios';
import CameraDto from 'dtos/camera.dto';
import CamerasDto from 'dtos/cameras.dto';
import DisableCamera from 'dtos/disableCamera.dto';
import { SearchCameraDto } from 'dtos/searchCameraByName.dto';
import Camera from 'models/camera.model';

import axiosClient from './axiosClient';

const cameraServices = {
  getCameras: (numOfPage: number): Promise<AxiosResponse<CamerasDto>> => {
    const url = `/cameras`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getCamera: (id: string): Promise<AxiosResponse<Camera>> => {
    const url = `/cameras/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addCamera: (payload: CameraDto): Promise<AxiosResponse<Camera>> => {
    const url = '/cameras';
    return axiosClient.post(url, payload);
  },
  updateCamera: (payload: Camera): Promise<AxiosResponse<Camera>> => {
    const url = `/cameras/${payload.cameraId}`;
    return axiosClient.put(url, payload);
  },
  disableCamera: (id: string): Promise<AxiosResponse<DisableCamera>> => {
    const url = `/cameras/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 0,
      },
    ]);
  },
  activateCamera: (id: string): Promise<AxiosResponse<DisableCamera>> => {
    const url = `/cameras/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 2,
      },
    ]);
  },
  searchCameras: ({
    page,
    search,
    beginDate,
    endDate,
    status,
  }: SearchCameraDto): Promise<AxiosResponse<CamerasDto>> => {
    const url = `/cameras`;
    return axiosClient.get(url, {
      params: { page, search, beginDate, endDate, status },
    });
  },
};

export default cameraServices;
