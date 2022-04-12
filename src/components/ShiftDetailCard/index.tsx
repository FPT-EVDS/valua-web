/* eslint-disable prefer-destructuring */
import { Badge, Edit, EditOff, FileDownload, Lock } from '@mui/icons-material';
import { DateTimePicker } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  darken,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SemesterDropdown from 'components/SemesterDropdown';
import ShiftConfig, {
  notAllowEditShiftStatuses,
} from 'configs/constants/shiftConfig.status';
import { shiftSchema } from 'configs/validations';
import { format } from 'date-fns';
import ShiftDto from 'dtos/shift.dto';
import ShiftStatus from 'enums/shiftStatus.enum';
import {
  lockShift,
  startStaffing,
  updateShift,
} from 'features/shift/detailShiftSlice';
import saveAs from 'file-saver';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import React, { useEffect, useState } from 'react';
import attendanceServices from 'services/attendance.service';

interface Props {
  shift: Shift;
  isLoading: boolean;
  handleDelete: (shiftId: string) => void;
}

const ShiftDetailCard = ({ shift, isLoading, handleDelete }: Props) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    current: { totalItems },
  } = useAppSelector(state => state.examRoom);
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );

  const shiftConfigIndex = ShiftConfig.findIndex(
    value => value.value === shift.status,
  );
  // Set default config as unknown
  let shiftConfig = ShiftConfig[ShiftConfig.length - 1];
  if (shiftConfigIndex > -1) shiftConfig = ShiftConfig[shiftConfigIndex];

  const initialValues: ShiftDto = shift;
  const formik = useFormik({
    initialValues,
    validationSchema: shiftSchema,
    onSubmit: async (payload: ShiftDto) => {
      try {
        const result = await dispatch(updateShift(payload));
        unwrapResult(result);
        showSuccessMessage('Update shift successfully');
      } catch (error) {
        showErrorMessage(error);
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
    refreshFormValues().catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shift]);

  const handleSaveFile = async (shiftId: string) => {
    try {
      const response = await attendanceServices.downloadAttendances(shiftId);
      const fileExtension = '.xls';
      const fileName = `${shift.semester.semesterName} ${format(
        new Date(shift.beginTime),
        'dd-MM-yyyy--HH:mm',
      )}${fileExtension}`;
      saveAs(response.data, fileName);
    } catch (error) {
      showErrorMessage(String(error));
    }
  };

  const handleStaffing = async (shiftId: string) => {
    try {
      const result = await dispatch(startStaffing([{ shiftId }]));
      unwrapResult(result);
      showSuccessMessage('Start staffing successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const handleLockShift = async (shiftId: string) => {
    try {
      const result = await dispatch(lockShift([{ shiftId }]));
      unwrapResult(result);
      showSuccessMessage('Lock shift successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

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
          !notAllowEditShiftStatuses.has(shift.status) && (
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
                <Typography display="inline" ml={0.5} color={shiftConfig.color}>
                  {shiftConfig.label}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Stack spacing={2}>
              <Stack spacing={2} direction="row">
                {shift.status === ShiftStatus.Finished && (
                  <Button
                    variant="contained"
                    sx={{
                      minWidth: 120,
                      backgroundColor: '#47B881',
                      ':hover': { backgroundColor: darken('#47B881', 0.05) },
                    }}
                    startIcon={<FileDownload />}
                    onClick={async () => {
                      if (shift.shiftId) {
                        await handleSaveFile(shift.shiftId);
                      }
                    }}
                  >
                    Export attendance
                  </Button>
                )}
                {!notAllowEditShiftStatuses.has(shift.status) && (
                  <>
                    <Button
                      disabled={!isEditable}
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: 120 }}
                    >
                      Update
                    </Button>
                    <Button
                      disabled={!isEditable}
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(String(shift.shiftId))}
                      sx={{ minWidth: 120 }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Stack>
              {shift.status === ShiftStatus.NotReady && (
                <Button
                  variant="contained"
                  disabled={totalItems <= 0}
                  sx={{
                    backgroundColor: '#26A69A',
                    ':hover': { backgroundColor: darken('#26A69A', 0.05) },
                  }}
                  startIcon={<Badge />}
                  onClick={async () => {
                    if (shift) {
                      await handleStaffing(String(shift.shiftId));
                    }
                  }}
                >
                  Start staffing
                </Button>
              )}
              {shift.status === ShiftStatus.Ready && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#26A69A',
                    ':hover': { backgroundColor: darken('#26A69A', 0.05) },
                  }}
                  startIcon={<Lock />}
                  onClick={async () => {
                    await handleLockShift(String(shift.shiftId));
                  }}
                >
                  Lock shift
                </Button>
              )}
            </Stack>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default ShiftDetailCard;
