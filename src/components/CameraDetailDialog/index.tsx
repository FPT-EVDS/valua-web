import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { Close } from '@mui/icons-material';
import { LoadingButton, DatePicker } from '@mui/lab';
import {
  Box,
  Avatar,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDto from 'dtos/camera.dto';
import { addCamera } from 'features/camera/camerasSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  title: string;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initValues?: CameraDto;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

const CameraDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  initValues = {
    cameraId: '',
    room: null,
    purchaseDate: new Date(),
    createdDate: new Date(),
    lastModifiedDate: new Date(),
    configurationUrl: '',
    cameraName: '',
    description: '',
    status: 1,
  },
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);
  const formik = useFormik({
    initialValues: initValues,
    onSubmit: async (payload: CameraDto) => {
      try {
        const data = {
          ...payload,
        };
        const result = await dispatch(addCamera(data));
        unwrapResult(result);
        enqueueSnackbar('Add camera success', {
          variant: 'success',
          preventDuplicate: true,
        });
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const handleChangePurchasedDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('purchaseDate', selectedDate);
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
          {title}
          <IconButton onClick={handleClose}>
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
              <VideoCameraBackIcon fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="cameraName"
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={formik.values.cameraName}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Purchased Date"
                value={formik.values.purchaseDate}
                inputFormat="dd/MM/yyyy"
                onChange={date => handleChangePurchasedDate(date)}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="purchaseDate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
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
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="configurationUrl"
                autoFocus
                multiline
                margin="dense"
                label="Configuration URL"
                rows={4}
                value={formik.values.configurationUrl}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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

export default CameraDetailDialog;
