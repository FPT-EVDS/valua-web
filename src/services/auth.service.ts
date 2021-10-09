import { AxiosResponse } from 'axios';
import LoginDto from 'dtos/login.dto';
import LoginUser from 'dtos/loginUser.dto';
import User from 'models/user.model';

import axiosClient from './axiosClient';

const authServices = {
  login: (payload: LoginDto): Promise<AxiosResponse<LoginUser>> => {
    const url = '/authentication/login';
    return axiosClient.post(url, payload);
  },
  getUserProfile: (): Promise<AxiosResponse<User>> => {
    const url = '/authentication/profile';
    return axiosClient.get(url);
  },
};

export default authServices;
