import { ChevronLeft } from '@mui/icons-material';
import { Box, CircularProgress, Grid } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import ShiftDetailCard from 'components/ShiftDetailCard';
import { deleteShift, getShift } from 'features/shift/detailShiftSlice';
import Shift from 'models/shift.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
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

  const handleDeleteShift = async (shiftId: string) => {
    try {
      const result = await dispatch(deleteShift(shiftId));
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

  const showDeleteConfirmation = (shiftId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteShift(shiftId),
    }));
  };

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
        {shift ? (
          <Grid item xs={12} lg={3}>
            <ShiftDetailCard
              shift={shift}
              isLoading={isLoading}
              handleDelete={showDeleteConfirmation}
            />
          </Grid>
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </div>
  );
};

export default DetailShiftPage;
