import { AxiosResponse } from 'axios';
import DisableSemesterDto from 'dtos/disableSemester.dto';
import SemesterDto from 'dtos/semester.dto';
import SemestersDto from 'dtos/semesters.dto';
import Semester from 'models/semester.model';

import axiosClient from './axiosClient';

const semesterServices = {
  getSemesters: (numOfPage: number): Promise<AxiosResponse<SemestersDto>> => {
    const url = `/semesters`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getSemester: (id: string): Promise<AxiosResponse<Semester>> => {
    const url = `/semesters/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addSemester: (payload: SemesterDto): Promise<AxiosResponse<Semester>> => {
    const url = '/semesters';
    return axiosClient.post(url, payload);
  },
  updateSemester: (payload: SemesterDto): Promise<AxiosResponse<Semester>> => {
    const url = `/semesters/${String(payload.semesterId)}`;
    return axiosClient.put(url, payload);
  },
  disableSemester: (id: string): Promise<AxiosResponse<DisableSemesterDto>> => {
    const url = `/semesters/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
  getSemesterForShift: (): Promise<AxiosResponse<Semester[]>> => {
    const url = '/semesters/shiftManager';
    return axiosClient.get(url);
  },
};

export default semesterServices;
