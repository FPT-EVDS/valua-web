import { ChevronLeft, NotificationsActive } from '@mui/icons-material';
import { Box, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ViolationDetailCard from 'components/ViolationDetailCard';
import ViolationOverviewCard from 'components/ViolationOverviewCard';
import { format } from 'date-fns';
import { getViolation } from 'features/violation/detailViolationSlice';
import Violation from 'models/violation.model';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ViolationProps {
  violation: Violation;
}

interface ParamProps {
  id: string;
}

const DetailViolationPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const { violation, isLoading } = useAppSelector(
    state => state.detailViolation,
  );

  const fetchViolation = async (violationId: string) => {
    const actionResult = await dispatch(getViolation(violationId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchViolation(id).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OverviewContent = ({
    violation: { createdDate, lastModifiedDate },
  }: ViolationProps) => (
    <>
      <Typography gutterBottom color="text.secondary">
        Created at:{' '}
        {createdDate &&
          format(Date.parse(String(createdDate)), 'dd/MM/yyyy HH:mm')}
      </Typography>
      <Typography gutterBottom color="text.secondary">
        Last feedback at:{' '}
        {lastModifiedDate &&
          format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
      </Typography>
    </>
  );

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/shift-manager/violation')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to violation list</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {violation && (
          <>
            <Grid item xs={12} md={6}>
              <ViolationOverviewCard
                title={violation?.violationId}
                icon={<NotificationsActive fontSize="large" />}
                content={<OverviewContent violation={violation} />}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <ViolationDetailCard
                isLoading={isLoading}
                violation={violation}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailViolationPage;
