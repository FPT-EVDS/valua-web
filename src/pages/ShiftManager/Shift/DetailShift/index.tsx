import { ChevronLeft, Event } from '@mui/icons-material';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import OverviewCard from 'components/OverviewCard';
import { format } from 'date-fns';
import { getShift } from 'features/shift/detailShiftSlice';
import Shift from 'models/shift.model';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface ShiftProps {
  shift: Shift;
}

const DetailShiftPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const { shift, isLoading } = useAppSelector(state => state.detailShift);

  const fetchShift = async (shiftId: string) => {
    const actionResult = await dispatch(getShift(shiftId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    if (id)
      fetchShift(id).catch(error =>
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        }),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OverviewContent = ({ shift: { lastModifiedDate } }: ShiftProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  const GroupButtons = () => (
    <>
      <Button variant="text" color="error">
        Disable camera
      </Button>
    </>
  );

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/shift-manager/shift')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to shift page</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {shift && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <OverviewCard
                title={`${shift.subject.subjectCode} ${shift.semester.semesterName}`}
                icon={<Event fontSize="large" />}
                status={shift.isActive === true ? 1 : 0}
                content={<OverviewContent shift={shift} />}
                actionButtons={<GroupButtons />}
                isSingleAction
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <div>Hello detail</div>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailShiftPage;
