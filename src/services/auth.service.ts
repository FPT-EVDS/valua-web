import { AxiosResponse } from 'axios';
import LoginDto from 'dtos/login.dto';
import LoginUser from 'dtos/loginUser.dto';
import User from 'models/user.model';

import axiosClient from './axiosClient';

const authServices = {
  login: (payload: LoginDto): Promise<AxiosResponse<LoginUser>> => {
    const url = '/authentication/login';
    return axiosClient.post(url, { ...payload });
  },
  loginWithGoogle: () => {
    const redirectUri = process.env.REACT_APP_REDIRECT_URI ?? '';
    return `${String(
      axiosClient.defaults.baseURL,
    )}/oauth2/authorize/google?redirect_uri=${redirectUri}`;
  },
  getUserProfile: (): Promise<AxiosResponse<User>> => {
    const url = '/authentication/profile';
    return axiosClient.get(url);
  },
  updateUserProfile: (payload: User): Promise<AxiosResponse<User>> => {
    const url = `/authentication/profile`;
    return axiosClient.put(url, payload);
  },
};

export default authServices;
