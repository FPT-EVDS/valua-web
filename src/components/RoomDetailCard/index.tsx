import { Edit, EditOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import FloorDropdown from 'components/FloorDropdown';
import { roomSchema } from 'configs/validations';
import RoomDto from 'dtos/room.dto';
import { updateRoom } from 'features/room/detailRoomSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import Room from 'models/room.model';
import React, { useEffect, useState } from 'react';

interface Props {
  room: Room;
  isLoading: boolean;
}

const RoomDetailCard = ({ room, isLoading }: Props) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: RoomDto = room;
  const formik = useFormik({
    initialValues,
    validationSchema: roomSchema,
    onSubmit: async (payload: RoomDto) => {
      try {
        const result = await dispatch(updateRoom(payload));
        unwrapResult(result);
        showSuccessMessage('Update room successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const refreshFormValues = async () => {
    if (room) {
      await formik.setValues(room);
    }
  };

  const handleFloorChange = async (payload: number | null) => {
    await formik.setFieldValue('floor', payload);
  };

  useEffect(() => {
    refreshFormValues().catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <Card
      sx={{
        minWidth: 275,
        height: '100%',
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Room information
          </Typography>
        }
        action={
          room.status !== 0 && (
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
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                required
                name="roomName"
                margin="dense"
                label="Name"
                fullWidth
                disabled={!isEditable}
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
            <Grid item xs={12} md={4}>
              <FloorDropdown
                onChange={handleFloorChange}
                isEditable={isEditable}
                value={formik.values.floor}
                textFieldProps={{
                  required: true,
                  error: formik.touched.floor && Boolean(formik.errors.floor),
                  helperText: formik.touched.floor && formik.errors.floor,
                  InputLabelProps: {
                    shrink: true,
                  },
                  label: 'Floor',
                  name: 'floor',
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                required
                name="seatCount"
                margin="dense"
                label="Seat count"
                type="number"
                inputMode="numeric"
                fullWidth
                disabled={!isEditable}
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
                name="description"
                multiline
                margin="dense"
                label="Description"
                rows={8}
                disabled={!isEditable}
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
        </CardContent>
        {room.status !== 0 && (
          <>
            <CardActions>
              <LoadingButton
                disabled={!isEditable}
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Update room
              </LoadingButton>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

export default RoomDetailCard;
