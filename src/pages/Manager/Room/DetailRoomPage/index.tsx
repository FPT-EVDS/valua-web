import { ChevronLeft, SupervisorAccount } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import OverviewCard from 'components/OverviewCard';
import RoomDetailCard from 'components/RoomDetailCard';
import { format } from 'date-fns';
import { disableRoom, getRoom } from 'features/room/detailRoomSlice';
import Room from 'models/room.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface RoomProps {
  room: Room;
}

const DetailRoomPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { room, isLoading } = useAppSelector(state => state.detailRoom);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this room ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const history = useHistory();
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
      enqueueSnackbar('Disable room success', {
        variant: 'success',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
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
        Disable room
      </Button>
    </>
  );

  useEffect(() => {
    fetchRoom(id).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/manager/room')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to room page</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {room && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <OverviewCard
                title={room.roomName}
                icon={<SupervisorAccount fontSize="large" />}
                status={room.status}
                content={<OverviewContent room={room} />}
                actionButtons={<GroupButtons />}
                isSingleAction
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <RoomDetailCard isLoading={isLoading} room={room} />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailRoomPage;
