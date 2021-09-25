import { ChevronLeft, Edit, EditOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import OverviewCard from 'components/OverviewCard';
import AppUserDto from 'dtos/appUser.dto';
import { updateCamera } from 'features/camera/camerasSlice';
import { getCamera } from 'features/camera/detailCameraSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailCameraPage = () => {
  const dispatch = useAppDispatch();
  const camera = useAppSelector(state => state.detailCamera.camera);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const query = useQuery();
  const { id } = useParams<ParamProps>();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues = camera;

  const fetchCamera = async (cameraId: string) => {
    const actionResult = await dispatch(getCamera(cameraId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchCamera(id).catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GroupButtons = () => (
    <>
      <Button variant="text">Upload picture</Button>
      <Button variant="text" sx={{ color: grey[700] }}>
        Reset password
      </Button>
      <Button variant="text" color="error">
        Disable account
      </Button>
    </>
  );

  return (
    <div>
      
    </div>
  );
};

export default DetailCameraPage;
