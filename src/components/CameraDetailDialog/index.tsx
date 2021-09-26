import {
  AccountCircle,
  Close,
  Email,
  Home,
  Image,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDto from 'dtos/camera.dto';
import Status from 'enums/status.enum';
import { addAccount } from 'features/account/accountsSlice';
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
        enqueueSnackbar('Add account success', {
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
        <DialogContent />
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
