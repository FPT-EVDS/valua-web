import { AxiosResponse } from 'axios';
import FeedbackDto from 'dtos/feedback.dto';
import FeedbacksDto from 'dtos/feedbacks.dto';
import { SearchFeedbackDto } from 'dtos/searchFeedback.dto';
import Feedback from 'models/feedback.model';
import axiosClient from './axiosClient';


const feedbackServices = {
  getFeedbacks: (numOfPage: number): Promise<AxiosResponse<FeedbacksDto>> => {
    const url = `/feedbacks`;
    return axiosClient.get(url, { params: { numOfPage } });
  },
  getFeedback: (id: string): Promise<AxiosResponse<Feedback>> => {
    const url = `/feedbacks/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addFeedback: (payload: FeedbackDto): Promise<AxiosResponse<Feedback>> => {
    const url = '/feedbacks';
    return axiosClient.post(url, payload);
  },
  updateFeedback: (payload: Feedback): Promise<AxiosResponse<Feedback>> => {
    const url = `/feedbacks/${payload.feedbackId}`;
    return axiosClient.put(url, payload);
  },
  searchFeedbacks: ({
    page,
    search,
    beginDate,
    endDate,
    status,
  }: SearchFeedbackDto): Promise<AxiosResponse<FeedbacksDto>> => {
    const url = `/feedbacks`;
    return axiosClient.get(url, {
      params: { page, search, beginDate, endDate, status },
    });
  },
};

export default feedbackServices;
