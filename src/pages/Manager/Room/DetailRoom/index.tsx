import { Room as RoomIcon } from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import NotFoundItem from 'components/NotFoundItem';
import OverviewCard from 'components/OverviewCard';
import RoomDetailCard from 'components/RoomDetailCard';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import {
  disableRoom,
  enableRoom,
  getRoom,
} from 'features/room/detailRoomSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Room from 'models/room.model';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface RoomProps {
  room: Room;
}

const DetailRoomPage = () => {
  const dispatch = useAppDispatch();
  const { room, isLoading } = useAppSelector(state => state.detailRoom);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this room ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { id } = useParams<ParamProps>();

  const fetchRoom = async (roomId: string) => {
    const actionResult = await dispatch(getRoom(roomId));
    unwrapResult(actionResult);
  };

  const OverviewContent = ({ room: { lastModifiedDate } }: RoomProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const result = await dispatch(disableRoom(roomId));
      unwrapResult(result);
      showSuccessMessage('Disable room successfully');
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    } catch (error) {
      showErrorMessage(error);
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

  const handleEnableRoom = async (roomId: string) => {
    try {
      const result = await dispatch(enableRoom(roomId));
      unwrapResult(result);
      showSuccessMessage('Enable room successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const GroupButtons = () => (
    <>
      {room?.status !== Status.isDisable ? (
        <Button
          variant="text"
          color="error"
          onClick={() => showDeleteConfirmation(id)}
        >
          Disable room
        </Button>
      ) : (
        <Button
          variant="text"
          color="success"
          onClick={() => handleEnableRoom(id)}
        >
          Enable room
        </Button>
      )}
    </>
  );

  useEffect(() => {
    fetchRoom(id).catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <BackToPreviousPageButton
        title="Back to room page"
        route="/manager/rooms"
      />
      {room ? (
        <Grid container mt={2} spacing={2}>
          <Grid item xs={12} md={9} lg={4}>
            <Stack spacing={3}>
              <OverviewCard
                title={room.roomName}
                icon={<RoomIcon fontSize="large" />}
                status={room.status}
                content={<OverviewContent room={room} />}
                actionButtons={<GroupButtons />}
                isSingleAction
              />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={8}>
            <RoomDetailCard isLoading={isLoading} room={room} />
          </Grid>
        </Grid>
      ) : (
        <NotFoundItem isLoading={isLoading} message="Room not found" />
      )}
    </div>
  );
};

export default DetailRoomPage;
