import { AxiosResponse } from 'axios';
import LoginDto from 'dtos/login.dtos';
import User from 'models/user.models';

import axiosClient from './axiosClient';

const authServices = {
  login: (payload: LoginDto): Promise<AxiosResponse<User>> => {
    const url = '/authentication/login';
    return axiosClient.post(url, payload);
  },
};

export default authServices;
