import { AxiosResponse } from 'axios';
import ReportDashboardDto from 'dtos/reportDashboard.dto';
import ReportsDto from 'dtos/reports.dto';
import ResolveReportDto from 'dtos/resolveReport.dto';
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
  resolveReport: ({
    reportId,
    solution,
  }: ResolveReportDto): Promise<AxiosResponse<Report>> => {
    const url = `/reports/${reportId}`;
    return axiosClient.patch(url, { solution });
  },
  getReportOverview: (): Promise<AxiosResponse<ReportDashboardDto>> => {
    const url = '/reports/overview';
    return axiosClient.get(url);
  },
};

export default reportServices;
