/* eslint-disable prefer-destructuring */
import { Edit, EditOff } from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import SemesterDropdown from 'components/SemesterDropdown';
import { shiftSchema } from 'configs/validations';
import { format } from 'date-fns';
import ShiftDto from 'dtos/shift.dto';
import Status from 'enums/status.enum';
import { updateShift } from 'features/shift/detailShiftSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface Props {
  shift: Shift;
  isLoading: boolean;
  handleDelete: (shiftId: string) => void;
}

const ShiftDetailCard = ({ shift, isLoading, handleDelete }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );

  let statusColor = '#1890ff';
  let statusText = '';
  switch (shift.status) {
    case Status.isReady:
      statusColor = '#1890ff';
      statusText = 'Ready';
      break;

    case Status.isActive:
      statusColor = green[500];
      statusText = 'Active';
      break;

    case Status.isDisable:
      statusColor = red[500];
      statusText = 'Disable';
      break;

    default:
      break;
  }

  const initialValues: ShiftDto = shift;
  const formik = useFormik({
    initialValues,
    validationSchema: shiftSchema,
    onSubmit: async (payload: ShiftDto) => {
      try {
        const result = await dispatch(updateShift(payload));
        unwrapResult(result);
        enqueueSnackbar('Update shift success', {
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

  const handleChangeBeginTime = async (selectedDate: Date | null) => {
    await formik.setFieldValue('beginTime', selectedDate);
  };

  const handleChangeFinishTime = async (selectedDate: Date | null) => {
    await formik.setFieldValue('finishTime', selectedDate);
  };

  const handleChangeSemester = async (
    semester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    await formik.setFieldValue('semester', semester);
  };

  const refreshFormValues = async () => {
    if (shift) {
      await formik.setValues(shift);
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
  }, [shift]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Shift information
          </Typography>
        }
        action={
          shift.status === Status.isActive && (
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
            <Grid item xs={12}>
              <SemesterDropdown
                value={formik.values?.semester}
                isEditable={isEditable}
                onChange={handleChangeSemester}
                textFieldProps={{
                  error:
                    formik.touched.semester && Boolean(formik.errors.semester),
                  helperText: formik.touched.semester && formik.errors.semester,
                  InputLabelProps: {
                    shrink: true,
                  },
                  label: 'Semester',
                  name: 'semester',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="Begin time"
                value={formik.values.beginTime}
                inputFormat="dd/MM/yyyy HH:mm"
                onChange={date => handleChangeBeginTime(date)}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="beginTime"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.beginTime &&
                      Boolean(formik.errors.beginTime)
                    }
                    helperText={
                      formik.touched.beginTime && formik.errors.beginTime
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="End time"
                value={formik.values.finishTime}
                inputFormat="dd/MM/yyyy HH:mm"
                onChange={date => handleChangeFinishTime(date)}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="finishTime"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.finishTime &&
                      Boolean(formik.errors.finishTime)
                    }
                    helperText={
                      formik.touched.finishTime && formik.errors.finishTime
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography color="text.secondary">
                Last updated date:{' '}
                {format(new Date(shift.lastModifiedDate), 'dd/MM/yyyy HH:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box color="text.secondary">
                Status:
                <Typography display="inline" ml={0.5} color={statusColor}>
                  {statusText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Box>
              <Button
                disabled={!isEditable}
                type="submit"
                variant="contained"
                sx={{ width: 150, marginRight: 2 }}
              >
                Update
              </Button>
              <Button
                disabled={!isEditable}
                variant="contained"
                color="error"
                onClick={() => handleDelete(String(shift.shiftId))}
                sx={{ width: 150 }}
              >
                Delete
              </Button>
            </Box>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default ShiftDetailCard;
