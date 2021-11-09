import { ChevronLeft, Videocam } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDetailCard from 'components/CameraDetailCard';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import CameraOverviewCard from 'components/CameraOverviewCard';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import { disableCamera, getCamera } from 'features/camera/detailCameraSlice';
import Camera from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface CameraProps {
  camera: Camera;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      const result = await dispatch(disableCamera(cameraId));
      unwrapResult(result);
      enqueueSnackbar('Delete camera success', {
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
        color="error"
        onClick={() => showDeleteConfirmation(id)}
      >
        Delete camera
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
              <CameraOverviewCard
                title={camera.cameraName}
                icon={<Videocam fontSize="large" />}
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
