import { ChevronLeft, Event } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import OverviewCard from 'components/OverviewCard';
import ShiftDetailCard from 'components/ShiftDetailCard';
import { format } from 'date-fns';
import { deleteShift, getShift } from 'features/shift/detailShiftSlice';
import Shift from 'models/shift.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
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
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this shift ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });

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

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const result = await dispatch(deleteShift(roomId));
      unwrapResult(result);
      enqueueSnackbar('Delete shift success', {
        variant: 'success',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
      history.push('/shift-manager/shift');
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const showDeleteConfirmation = (roomId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteRoom(roomId),
    }));
  };

  const GroupButtons = () => (
    <>
      <Button
        variant="text"
        color="error"
        onClick={() => showDeleteConfirmation(id)}
      >
        Delete shift
      </Button>
    </>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
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
          </>
        )}
        <Grid item xs={12} lg={shift ? 8 : 12}>
          <ShiftDetailCard
            shift={shift}
            isLoading={isLoading}
            isUpdate={!!shift}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailShiftPage;
