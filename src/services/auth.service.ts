import { AxiosResponse } from 'axios';

import axiosClient from './axiosClient';
import LoginRequestDto from '../dtos/authentication/loginRequest.dto';
import LoginResponseDto from '../dtos/authentication/loginResponse.dto';
import { generateSignature } from '../utils/signatureUtil';
import AppConstants from '../enums/app';
import Account from '../models/authentication/authentication.account.model';

const authServices = {
  login: (payload: LoginRequestDto): Promise<AxiosResponse<LoginResponseDto>> => {
    //throw ({ "errorCode": 12070, "errorMessage": "Incorrect username or password", "statusCode": 400 });
    const url = '/authentication/login';
    const language = sessionStorage.getItem('lang')
    payload.signature = generateSignature(payload.email, payload.password, language ? language : AppConstants.LANGUAGE_ENGLISH);
    return axiosClient.post(url, { ...payload });
  },
  getUserProfile: (): Promise<AxiosResponse<Account>> => {
    const url = '/authentication/profile';
    return axiosClient.get(url);
  },
};

export default authServices;
