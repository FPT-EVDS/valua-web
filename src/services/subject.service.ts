import { AxiosResponse } from 'axios';
import AvailableSubjects from 'dtos/availableSubjects.dto';
import DisableSubjectDto from 'dtos/disableSubject.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
import SubjectDto from 'dtos/subject.dto';
import SubjectsDto from 'dtos/subjects.dto';
import Subject from 'models/subject.model';

import axiosClient from './axiosClient';

const subjectServices = {
  getSubjects: (numOfPage: number): Promise<AxiosResponse<SubjectsDto>> => {
    const url = `/subjects`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getSubject: (id: string): Promise<AxiosResponse<Subject>> => {
    const url = `/subjects/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addSubject: (payload: SubjectDto): Promise<AxiosResponse<Subject>> => {
    const url = '/subjects';
    return axiosClient.post(url, payload);
  },
  updateSubject: (payload: SubjectDto): Promise<AxiosResponse<Subject>> => {
    const url = `/subjects/${String(payload.subjectId)}`;
    return axiosClient.put(url, payload);
  },
  disableSubject: (id: string): Promise<AxiosResponse<DisableSubjectDto>> => {
    const url = `/subjects/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
  activeSubject: (id: string): Promise<AxiosResponse<DisableSubjectDto>> => {
    const url = `/subjects/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: true,
      },
    ]);
  },
  getSubjectsForShift: (): Promise<AxiosResponse<Subject[]>> => {
    const url = '/subjects/shiftManager';
    return axiosClient.get(url);
  },
  searchSubjects: ({
    search,
    page,
    sort,
    status,
  }: SearchByNameDto): Promise<AxiosResponse<SubjectsDto>> => {
    const url = `/subjects`;
    return axiosClient.get(url, {
      params: {
        page,
        search,
        sort,
        status,
      },
    });
  },
  getAvailableSubjects: (
    semesterId: string,
  ): Promise<AxiosResponse<AvailableSubjects>> => {
    const url = `/subjects/available`;
    return axiosClient.get(url, {
      params: {
        value: true,
        semesterId,
      },
    });
  },
};

export default subjectServices;
