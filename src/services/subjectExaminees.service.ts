import { AxiosResponse } from 'axios';
import DetailSubjectExamineeDto from 'dtos/detailSubjectExaminee';
import SubjectExamineesDto from 'dtos/subjectExaminees.dto';
import SubjectExaminee from 'models/subjectExaminee.model';

import axiosClient from './axiosClient';

const subjectExamineesServices = {
  add: (
    payload: SubjectExamineesDto,
  ): Promise<AxiosResponse<SubjectExaminee[]>> => {
    const url = `/subjectExaminees`;
    return axiosClient.post(url, payload);
  },
  getDetail: ({
    semesterId,
    subjectId,
  }: {
    semesterId: string;
    subjectId: string;
  }): Promise<AxiosResponse<DetailSubjectExamineeDto>> => {
    const url = '/subjectExaminees/subject';
    return axiosClient.get(url, {
      params: {
        semesterId,
        subjectId,
      },
    });
  },
};
export default subjectExamineesServices;
