import { ChevronLeft } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDetailCard from 'components/CameraDetailCard';
import OverviewCard from 'components/OverviewCard';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import { disableCamera, getCamera } from 'features/camera/detailCameraSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { format } from 'date-fns';
import Cameram from 'models/camera.model';
interface ParamProps {
  id: string;
}

interface CameraProps {
  camera: Cameram;
}
const DetailCameraPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const { camera, isLoading } = useAppSelector(state => state.detailCamera);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this camera ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });

  const fetchCamera = async (cameraId: string) => {
    const actionResult = await dispatch(getCamera(cameraId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchCamera(id).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
  }, []);

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      const result = await dispatch(disableCamera(cameraId));
      unwrapResult(result);
      enqueueSnackbar('Disable camera success', {
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

  const showDeleteConfirmation = (cameraId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteCamera(cameraId),
    }));
  };

  const GroupButtons = () => (
    <>
      <Button
        variant="text"
        color={'error'}
        onClick={() => showDeleteConfirmation(id)}
      >
        Disable camera
      </Button>
    </>
  );

  const OverviewContent = ({ camera: { lastModifiedDate } }: CameraProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/manager/camera')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to camera page</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {camera && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <OverviewCard
                title={camera.cameraName}
                icon={<VideoCameraBackIcon fontSize="large" />}
                status={camera.status}
                content={<OverviewContent camera={camera} />}
                actionButtons={<GroupButtons />}
                isSingleAction
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <CameraDetailCard isLoading={isLoading} camera={camera} />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailCameraPage;
