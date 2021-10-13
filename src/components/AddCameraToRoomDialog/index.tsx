import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDropdown from 'components/CameraDropdown';
import AddCameraRoomDto from 'dtos/addCameraRoom.dto';
import RoomWithCamera from 'dtos/roomWithCamera.dto';
import { addCameraToRoom } from 'features/room/detailRoomSlice';
import { useFormik } from 'formik';
import Camera from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

const AddCameraToRoomDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const roomWithCamera = useAppSelector(
    state => state.detailRoom.roomWithCamera,
  );
  const {
    room: { roomId },
  } = roomWithCamera as RoomWithCamera;

  const formik = useFormik({
    initialValues: {
      cameraId: '',
      roomId: '',
    },
    onSubmit: async (payload: AddCameraRoomDto) => {
      try {
        const result = await dispatch(
          addCameraToRoom({ ...payload, roomId: String(roomId) }),
        );
        unwrapResult(result);
        enqueueSnackbar('Add camera to room success', {
          variant: 'success',
          preventDuplicate: true,
        });
        formik.resetForm();
        handleClose();
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const handleChangeCamera = async (selectedCamera: Camera | null) => {
    await formik.setFieldValue('cameraId', selectedCamera?.cameraId);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">Add camera to room</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" pb={2} onSubmit={formik.handleSubmit}>
        <DialogContent>
          <CameraDropdown onChange={value => handleChangeCamera(value)} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton type="submit" variant="contained" sx={{ width: 150 }}>
            Add
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddCameraToRoomDialog;
