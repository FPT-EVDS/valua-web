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
import RoomDto from 'dtos/room.dto';
import { updateRoom } from 'features/room/detailRoomSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Room from 'models/room.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface Props {
  room: Room;
  isLoading: boolean;
}

const RoomDetailCard = ({ room, isLoading }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: RoomDto = room;
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: RoomDto) => {
      try {
        const result = await dispatch(updateRoom(payload));
        unwrapResult(result);
        enqueueSnackbar('Update room success', {
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
    if (room) {
      await formik.setValues(room);
    }
  };

  useEffect(() => {
    refreshFormValues().catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
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
      <Box component="form" onSubmit={formik.handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
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
