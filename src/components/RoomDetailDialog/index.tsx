import { Close, Room } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SlideTransition from 'components/SlideTransition';
import { roomSchema } from 'configs/validations';
import RoomDto from 'dtos/room.dto';
import { addRoom } from 'features/room/roomsSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  title: string;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValues?: RoomDto;
}

const RoomDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  initialValues = {
    roomId: null,
    roomName: '',
    description: '',
    floor: 1,
    seatCount: 30,
  },
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.room.isLoading);
  const formik = useFormik({
    initialValues,
    validationSchema: roomSchema,
    onSubmit: async (payload: RoomDto) => {
      try {
        const result = await dispatch(addRoom(payload));
        unwrapResult(result);
        enqueueSnackbar('Create room success', {
          variant: 'success',
          preventDuplicate: true,
        });
        formik.resetForm();
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      fullWidth
      TransitionComponent={SlideTransition}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          {title}
          <IconButton onClick={handleModalClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit} pb={2}>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <Avatar
              sx={{
                bgcolor: '#1890ff',
                mb: 2,
                width: 150,
                height: 150,
                borderRadius: '3px',
              }}
              variant="square"
            >
              <Room fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="roomName"
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={formik.values.roomName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.roomName && Boolean(formik.errors.roomName)
                }
                helperText={formik.touched.roomName && formik.errors.roomName}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="seatCount"
                autoFocus
                margin="dense"
                label="Seat count"
                type="number"
                inputMode="numeric"
                fullWidth
                value={formik.values.seatCount}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.seatCount && Boolean(formik.errors.seatCount)
                }
                helperText={formik.touched.seatCount && formik.errors.seatCount}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="floor"
                autoFocus
                margin="dense"
                label="Floor"
                type="number"
                inputMode="numeric"
                fullWidth
                value={formik.values.floor}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                error={formik.touched.floor && Boolean(formik.errors.floor)}
                helperText={formik.touched.floor && formik.errors.floor}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                autoFocus
                multiline
                margin="dense"
                label="Description"
                rows={4}
                value={formik.values.description}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            loading={isLoading}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default RoomDetailDialog;
