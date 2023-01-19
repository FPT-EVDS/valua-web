import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import LoginResponseDto from '../dtos/authentication/loginResponse.dto';
import LoginRequestDto from '../dtos/authentication/loginRequest.dto';

const authenticationService = {
  login: (payload: LoginRequestDto): Promise<AxiosResponse<LoginResponseDto>> => {
    const url = '/authentication/login';
    return axiosClient.post(url, { ...payload });
  },
  getUserProfile: (): Promise<AxiosResponse<Account>> => {
    const url = '/authentication/profile';
    return axiosClient.get(url);
  }
};

export default authenticationService;
