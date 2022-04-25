import { AxiosResponse } from 'axios';
import Config from 'models/config.model';

import axiosClient from './axiosClient';

const configServices = {
  getConfig: (): Promise<AxiosResponse<Config>> => {
    const url = '/config';
    return axiosClient.get(url);
  },
  updateConfig: (payload: Config): Promise<AxiosResponse<Config>> => {
    const url = '/config';
    return axiosClient.put(url, payload);
  },
};

export default configServices;
