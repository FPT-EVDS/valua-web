import { AxiosResponse } from 'axios';
import CameraDto from 'dtos/camera.dto';
import Camera from 'models/camera.model';
import DisableCamera from 'dtos/disableCamera.dto';


import axiosClient from './axiosClient';

const accountServices = {
  getCameras: (numOfPage: number): Promise<AxiosResponse<CameraDto>> => {
    const url = `/cameras`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getCamera: (id: string): Promise<AxiosResponse<Camera>> => {
    const url = `/cameras/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addCamera: (payload: CameraDto): Promise<AxiosResponse<Camera>> => {
    const url = '/accounts';
    return axiosClient.post(url, payload);
  },
  updateCamera: (payload: CameraDto): Promise<AxiosResponse<Camera>> => {
    const url = '/accounts';
    return axiosClient.put(url, payload);
  },
  disableCamera: (id: string): Promise<AxiosResponse<DisableCamera>> => {
    const url = `/accounts/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/status',
        value: 0,
      },
    ]);
  },
};

export default accountServices;
