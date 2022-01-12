import Tool from 'models/tool.model';

import PagingDto from './paging.dto';

interface ToolsDto extends PagingDto {
  tools: Array<Tool>;
}

export default ToolsDto;
