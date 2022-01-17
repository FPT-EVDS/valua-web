import { AxiosResponse } from 'axios';
import ReportsDto from 'dtos/reports.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
import Report from 'models/report.model';

import axiosClient from './axiosClient';

const reportServices = {
  getReports: (
    payload: SearchByNameDto,
  ): Promise<AxiosResponse<ReportsDto>> => {
    const url = `/reports`;
    return axiosClient.get(url, { params: { ...payload } });
  },
  getReport: (id: string): Promise<AxiosResponse<Report>> => {
    const url = `/reports/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
};

export default reportServices;
