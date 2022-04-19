/* eslint-disable react/require-default-props */

import { WeekView } from '@devexpress/dx-react-scheduler-material-ui';
import { Close } from '@mui/icons-material';
import { DateTimePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SemesterDropdown from 'components/SemesterDropdown';
import ShiftScheduler from 'components/ShiftScheduler';
import SlideTransition from 'components/SlideTransition';
import { shiftSchema } from 'configs/validations';
import { add, format, isAfter, isEqual } from 'date-fns';
import ShiftDto from 'dtos/shift.dto';
import { addShift, getShiftOverview } from 'features/shift/shiftSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  initialValues?: ShiftDto;
}

const ShiftDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues,
}) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const formatter = 'dd/MM/yyyy';
  const { isLoading, shift: shiftSchedule } = useAppSelector(
    state => state.shift,
  );
  const [semester, setSemester] = useState<Semester | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const formik = useFormik({
    initialValues: initialValues || {
      shiftId: null,
      semester,
      beginTime: add(new Date(), { days: 1, hours: 1 }),
      finishTime: add(new Date(), { days: 1, hours: 2 }),
    },
    validationSchema: shiftSchema,
    onSubmit: async (payload: ShiftDto) => {
      try {
        const result = await dispatch(addShift(payload));
        const shift = unwrapResult(result);
        showSuccessMessage('Create shift successfully');
        formik.resetForm();
        await formik.setFieldValue('semester', shift.semester);
        handleClose();
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
    _selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    const shiftSemester = _selectedSemester as Semester;
    if (shiftSemester) {
      setSemester(shiftSemester);
      await formik.setFieldValue('semester', _selectedSemester);
      if (isAfter(new Date(shiftSemester.beginDate), new Date())) {
        await handleChangeBeginTime(shiftSemester.beginDate);
        await handleChangeFinishTime(
          add(new Date(shiftSemester.beginDate), { hours: 1 }),
        );
      } else {
        await handleChangeBeginTime(add(new Date(), { days: 1 }));
        await handleChangeFinishTime(add(new Date(), { days: 1, hours: 1 }));
      }
    }
  };

  const fetchShifts = () => {
    const selectedDate =
      semester?.semesterId !== shiftSchedule.data?.currentSemester.semesterId
        ? undefined
        : format(currentDate, 'yyyy-MM-dd');
    dispatch(
      getShiftOverview({
        selectedDate,
        semesterId: semester?.semesterId,
      }),
    )
      .then(result => {
        const shifts = unwrapResult(result);
        const startOfWeek = new Date(shifts.week.split(' - ')[0]);
        if (!isEqual(startOfWeek, currentDate)) {
          setCurrentDate(startOfWeek);
        }
        return shifts;
      })
      .catch(error => showErrorMessage(String(error)));
  };

  useEffect(() => {
    handleChangeSemester(semester).catch(error => showErrorMessage(error));
  }, [semester]);

  useEffect(() => {
    fetchShifts();
  }, [semester, currentDate]);

  const handleCellDoubleClick = async (props: WeekView.TimeTableCellProps) => {
    const { startDate, endDate } = props;
    if (startDate) {
      await handleChangeBeginTime(startDate);
    }
    if (endDate) {
      await handleChangeFinishTime(endDate);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xl"
      TransitionComponent={SlideTransition}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">Create shift</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          pb={2}
          display="flex"
          justifyContent="center"
          noValidate
        >
          <Grid container spacing={2} mt={2}>
            <Grid item lg={9}>
              <Paper elevation={2}>
                <ShiftScheduler
                  isLoading={shiftSchedule.isLoading}
                  currentDate={currentDate}
                  shifts={shiftSchedule.data?.shifts}
                  handleCellDoubleClick={handleCellDoubleClick}
                  handleCurrentDateChange={setCurrentDate}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Stack spacing={4}>
                <SemesterDropdown
                  value={formik.values.semester}
                  isEditable
                  onChange={handleChangeSemester}
                  textFieldProps={{
                    error:
                      formik.touched.semester &&
                      Boolean(formik.errors.semester),
                    helperText:
                      formik.errors.semester ??
                      (semester &&
                        `Duration: ${format(
                          new Date(semester.beginDate),
                          formatter,
                        )} -
                          ${format(new Date(semester.endDate), formatter)}
                        `),
                    InputLabelProps: {
                      shrink: true,
                    },
                    label: 'Semester',
                    name: 'semester',
                  }}
                  payload={{
                    beginDate: format(new Date(), 'yyyy-MM-dd'),
                  }}
                />
                <DateTimePicker
                  label="Begin time"
                  minDate={
                    semester !== null ? new Date(semester.beginDate) : undefined
                  }
                  maxDate={
                    semester !== null ? new Date(semester.endDate) : undefined
                  }
                  value={formik.values.beginTime}
                  inputFormat="dd/MM/yyyy HH:mm"
                  onChange={handleChangeBeginTime}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="beginTime"
                      margin="dense"
                      fullWidth
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
                <DateTimePicker
                  label="End time"
                  value={formik.values.finishTime}
                  inputFormat="dd/MM/yyyy HH:mm"
                  onChange={handleChangeFinishTime}
                  minDateTime={new Date(formik.values.beginTime)}
                  maxDate={
                    semester !== null ? new Date(semester.endDate) : undefined
                  }
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="endTime"
                      margin="dense"
                      fullWidth
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
                <Box display="flex" justifyContent="center">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    onClick={e => {
                      e.preventDefault();
                      formik.handleSubmit();
                    }}
                    sx={{ width: 150 }}
                    loading={isLoading}
                  >
                    Create
                  </LoadingButton>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ShiftDetailDialog;
