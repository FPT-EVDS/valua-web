import { ChevronLeft } from '@mui/icons-material';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import { Box, Button, Grid, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import CameraDetailCard from 'components/CameraDetailCard';
import OverviewCard from 'components/OverviewCard';
import { format } from 'date-fns';
import { getCamera } from 'features/camera/detailCameraSlice';
import CameraM from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Status from 'enums/status.enum';

interface ParamProps {
  id: string;
}

interface CameraProps {
  camera: CameraM;
}

const DetailCameraPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const { camera, isLoading } = useAppSelector(state => state.detailCamera);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this room ?`,
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

  const OverviewContent = ({ camera: { lastModifiedDate } }: CameraProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  const GroupButtons = ({ camera: { status } }: CameraProps) => (
    <>
      <Button
        variant="text"
        color={status == Status.isActive ? 'error' : 'success'}
      >
        {status == Status.isActive ? 'Disable camera' : 'Active camera'}
      </Button>
    </>
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
                actionButtons={<GroupButtons camera={camera} />}
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
