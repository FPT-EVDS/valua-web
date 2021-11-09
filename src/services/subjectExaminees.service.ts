import { AxiosResponse } from 'axios';
import AddedExamineeSubject from 'dtos/addedExamineeSubject.dto';
import DetailSubjectExamineeDto from 'dtos/detailSubjectExaminee';
import ExamineeSubject from 'dtos/examineeSubject.dto';
import RemoveSubjectExamineeDto from 'dtos/removeExaminee.dto';
import SearchParams from 'dtos/searchParams.dto';
import { SearchSubjectExamineeParams } from 'dtos/searchSubjectExamineeParams.dto';
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
  searchBySemester: ({
    page,
    semesterId,
    size,
    sort,
  }: SearchParams & { semesterId: string }): Promise<
    AxiosResponse<ExamineeSubject>
  > => {
    const url = '/subjectExaminees';
    return axiosClient.get(url, { params: { page, semesterId, size, sort } });
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
};
export default subjectExamineesServices;
