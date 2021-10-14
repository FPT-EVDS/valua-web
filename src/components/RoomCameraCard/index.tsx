import { Videocam, VideocamOff } from '@mui/icons-material';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddCameraToRoomDialog from 'components/AddCameraToRoomDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import RoomWithCamera from 'dtos/roomWithCamera.dto';
import { removeCameraFromRoom } from 'features/room/detailRoomSlice';
import Camera from 'models/camera.model';
import Room from 'models/room.model';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

const RoomCameraCard = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const roomWithCamera: RoomWithCamera | null = useAppSelector(
    state => state.detailRoom.roomWithCamera,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to remove this camera?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });

  const handleDeleteRoom = async (roomId: string) => {
    try {
      if (roomWithCamera) {
        const result = await dispatch(removeCameraFromRoom(roomId));
        unwrapResult(result);
        enqueueSnackbar(
          `Remove camera ${
            (roomWithCamera.camera as Camera).cameraName
          } from room ${roomWithCamera.room.roomName} success`,
          {
            variant: 'success',
            preventDuplicate: true,
          },
        );
        setConfirmDialogProps(prevState => ({
          ...prevState,
          open: false,
        }));
      }
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

  const showDeleteConfirmation = (camera: Camera | null, room: Room) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove camera ${String(camera?.cameraName)} from ${
        room.roomName
      }`,
      handleAccept: () => handleDeleteRoom(room.roomId),
    }));
  };

  return (
    <>
      <AddCameraToRoomDialog open={open} handleClose={() => setOpen(false)} />
      <ConfirmDialog {...confirmDialogProps} />
      <Card sx={{ minWidth: 275 }} elevation={2}>
        <CardContent>
          <Stack
            direction="column"
            spacing={1}
            justifyContent="center"
            alignItems="center"
          >
            {roomWithCamera?.camera ? (
              <Videocam sx={{ width: 64, height: 64 }} color="primary" />
            ) : (
              <VideocamOff
                sx={{ width: 64, height: 64, color: 'text.secondary' }}
              />
            )}
            <Typography color="text.secondary" gutterBottom>
              {roomWithCamera?.camera
                ? roomWithCamera.camera.cameraName
                : 'No camera added'}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          {roomWithCamera?.camera ? (
            <Button
              variant="text"
              color="error"
              onClick={() => {
                showDeleteConfirmation(
                  roomWithCamera.camera,
                  roomWithCamera.room,
                );
              }}
            >
              Remove camera
            </Button>
          ) : (
            <Button variant="contained" onClick={() => setOpen(true)}>
              Add camera
            </Button>
          )}
        </CardActions>
      </Card>
    </>
  );
};

export default RoomCameraCard;
