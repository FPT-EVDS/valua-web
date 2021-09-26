import {
  AccountCircle,
  Edit,
  EditOff,
  Email,
  Home,
  Image,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import genders from 'configs/constants/genders.constant';
import CameraDto from 'dtos/camera.dto';
import Status from 'enums/status.enum';
import { updateCamera } from 'features/camera/detailCameraSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Camera from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface Props {
  camera: Camera;
  isLoading: boolean;
}

const CameraDetailCard = ({ camera, isLoading }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: Camera = { ...camera };
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: Camera) => {
      try {
        const data = {
          ...payload,
        };
        const result = await dispatch(updateCamera(data));
        unwrapResult(result);
        enqueueSnackbar('Update account success', {
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

  const refreshFormValues = async () => {
    if (camera) {
      await formik.setValues({
        ...camera,
      });
    }
  };

  const handleChangePurchasedDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('purchasedDate', selectedDate);
  };

  useEffect(() => {
    refreshFormValues().catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Camera Infomartion
          </Typography>
        }
        action={
          camera?.status === Status.isActive && (
            <IconButton onClick={() => setIsEditable(prevState => !prevState)}>
              {isEditable ? (
                <EditOff sx={{ fontSize: 20 }} />
              ) : (
                <Edit sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          )
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="cameraName"
                margin="dense"
                label="Camera name"
                fullWidth
                variant="outlined"
                value={formik.values.cameraName}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="roomName"
                margin="dense"
                label="Room name"
                fullWidth
                variant="outlined"
                value={formik.values.room?.roomName}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Purchased Date"
                value={formik.values.purchaseDate}
                inputFormat="dd/MM/yyyy"
                onChange={date => handleChangePurchasedDate(date)}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="purchasedDate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Last Modified Date"
                value={formik.values.purchaseDate}
                inputFormat="dd/MM/yyyy"
                onChange={date => handleChangePurchasedDate(date)}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="lastModifiedDate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
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
                margin="dense"
                disabled={!isEditable}
                label="Description"
                fullWidth
                value={formik.values.description}
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
                margin="dense"
                disabled={!isEditable}
                label="Configuration Url"
                fullWidth
                value={formik.values.configurationUrl}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        {camera?.status === Status.isActive && (
          <>
            <Divider />
            <CardActions>
              <LoadingButton
                disabled={!isEditable}
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Update camera
              </LoadingButton>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

export default CameraDetailCard;
