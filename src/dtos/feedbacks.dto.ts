import Feedback from 'models/feedback.model';

import PagingDto from './paging.dto';

interface FeedbacksDto extends PagingDto {
  feedbacks: Array<Feedback>;
}

export default FeedbacksDto;
