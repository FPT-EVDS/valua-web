import { AxiosResponse } from 'axios';
import { SearchViolationDto } from 'dtos/searchViolation.dto';
import ViolationsDto from 'dtos/violations.dto';
import Violation from 'models/violation.model';
import axiosClient from './axiosClient';

const violationServices = {
  getViolations: (numOfPage: number): Promise<AxiosResponse<ViolationsDto>> => {
    const url = `/violations`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getViolation: (id: string): Promise<AxiosResponse<Violation>> => {
    const url = `/violations/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  searchViolations: ({
    page,
    search,
    beginDate,
    endDate,
    status,
  }: SearchViolationDto): Promise<AxiosResponse<ViolationsDto>> => {
    const url = `/violations`;
    return axiosClient.get(url, {
      params: { page, search, beginDate, endDate, status },
    });
  },
};

export default violationServices;
