import { AxiosResponse } from 'axios';
import AddedExamineeSubject from 'dtos/addedExamineeSubject.dto';
import DetailSubjectExamineeDto from 'dtos/detailSubjectExaminee';
import ExamineeSubject from 'dtos/examineeSubject.dto';
import ImportExcelDto from 'dtos/importExcel.dto';
import RemoveSubjectExamineeDto from 'dtos/removeExaminee.dto';
import SearchParams from 'dtos/searchParams.dto';
import { SearchSubjectExamineeParams } from 'dtos/searchSubjectExamineeParams.dto';
import SubjectExamineesDashboardDto from 'dtos/subjectExamineeDashboard.dto';
import SubjectExamineesDto from 'dtos/subjectExaminees.dto';
import SubjectExaminee from 'models/subjectExaminee.model';

import axiosClient from './axiosClient';

const subjectExamineesServices = {
  add: (
    payload: SubjectExamineesDto[],
  ): Promise<AxiosResponse<AddedExamineeSubject[]>> => {
    const url = `/subjectExaminees`;
    return axiosClient.post(url, payload);
  },
  import: (payload: FormData): Promise<AxiosResponse<ImportExcelDto[]>> => {
    const url = '/subjectExaminees/import';
    return axiosClient.post(url, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  downloadFailedImportFile: (path: string): Promise<AxiosResponse> => {
    const url = `/${path}`;
    return axiosClient.get(url, {
      responseType: 'blob',
      headers: {
        Accept: '*/*',
      },
    });
  },
  searchBySemester: (
    payload: SearchParams & { semesterId: string; isReady?: number },
  ): Promise<AxiosResponse<ExamineeSubject>> => {
    const url = '/subjectExaminees';
    return axiosClient.get(url, { params: { ...payload } });
  },
  getDetail: (
    payload: SearchSubjectExamineeParams,
  ): Promise<AxiosResponse<DetailSubjectExamineeDto>> => {
    const url = '/subjectExaminees/subject';
    return axiosClient.get(url, {
      params: {
        ...payload,
      },
    });
  },
  removeExamineeFromSubject: ({
    subjectExamineeId,
    removedReason,
  }: RemoveSubjectExamineeDto): Promise<AxiosResponse<SubjectExaminee>> => {
    const url = `/subjectExaminees/${subjectExamineeId}`;
    return axiosClient.put(url, { removedReason });
  },
  getSubjectExamineeOverview: (): Promise<
    AxiosResponse<SubjectExamineesDashboardDto>
  > => {
    const url = '/subjectExaminees/overview';
    return axiosClient.get(url);
  },
};
export default subjectExamineesServices;
