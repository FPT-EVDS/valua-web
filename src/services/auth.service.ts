import { AxiosResponse } from 'axios';
import LoginDto from 'dtos/login.dto';
import User from 'models/user.model';

import axiosClient from './axiosClient';

const authServices = {
  login: (payload: LoginDto): Promise<AxiosResponse<User>> => {
    const url = '/authentication/login';
    return axiosClient.post(url, payload);
  },
};

export default authServices;
