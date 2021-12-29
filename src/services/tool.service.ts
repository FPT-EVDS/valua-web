import { AxiosResponse } from 'axios';
import DisableToolDto from 'dtos/disableTool.dto';
import SearchByNameDto from 'dtos/searchByName.dto';
import ToolDto from 'dtos/tool.dto';
import ToolsDto from 'dtos/tools.dto';
import Tool from 'models/tool.model';

import axiosClient from './axiosClient';

const toolServices = {
  getTool: (id: string): Promise<AxiosResponse<Tool>> => {
    const url = `/tools/${id}`;
    return axiosClient.get(url, { params: { id } });
  },
  addTool: (payload: ToolDto): Promise<AxiosResponse<Tool>> => {
    const url = '/tools';
    return axiosClient.post(url, payload);
  },
  updateTool: (payload: ToolDto): Promise<AxiosResponse<Tool>> => {
    const url = `/tools/${String(payload.toolId)}`;
    return axiosClient.put(url, payload);
  },
  disableTool: (id: string): Promise<AxiosResponse<DisableToolDto>> => {
    const url = `/tools/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: false,
      },
    ]);
  },
  activeTool: (id: string): Promise<AxiosResponse<DisableToolDto>> => {
    const url = `/tools/${id}`;
    return axiosClient.patch(url, [
      {
        op: 'replace',
        path: '/isActive',
        value: true,
      },
    ]);
  },
  searchTools: ({
    search,
    page,
    sort,
    status,
  }: SearchByNameDto): Promise<AxiosResponse<ToolsDto>> => {
    const url = `/tools`;
    return axiosClient.get(url, {
      params: {
        page,
        search,
        sort,
        status,
      },
    });
  },
};

export default toolServices;
