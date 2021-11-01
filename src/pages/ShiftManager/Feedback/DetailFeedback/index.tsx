import { ChevronLeft } from '@mui/icons-material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { Box, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import FeedbackDetailCard from 'components/FeedbackDetailCard';
import FeedbackOverviewCard from 'components/FeedbackOverviewCard';
import ViolationInformationCard from 'components/ViolationInformationCard';
import { format } from 'date-fns';
import { getFeedback } from 'features/feedback/detailFeedbackSlice';
import Feedback from 'models/feedback.model';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface FeedbackProps {
  feedback: Feedback;
}

interface ParamProps {
  id: string;
}

const DetailFeedbackPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const { feedback, isLoading } = useAppSelector(state => state.detailFeedback);

  const fetchFeedback = async (feedbackId: string) => {
    const actionResult = await dispatch(getFeedback(feedbackId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchFeedback(id).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OverviewContent = ({ feedback: { violation } }: FeedbackProps) => (
    <Typography gutterBottom color="text.secondary">
      Created at:{' '}
      {violation &&
        format(Date.parse(String(violation?.createdDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/shift-manager/feedback')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Manage Feedbacks</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {feedback && (
          <>
            <Grid item xs={12} md={9} lg={6}>
              <FeedbackOverviewCard
                title={feedback?.feedbackId}
                status={feedback.status}
                icon={<AnnouncementIcon fontSize="large" />}
                content={<OverviewContent feedback={feedback} />}
                imageUrl="https://picsum.photos/200"
                fullName={feedback.shiftManager?.fullName}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <FeedbackDetailCard isLoading={isLoading} feedback={feedback} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <ViolationInformationCard violation={feedback?.violation} />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailFeedbackPage;
