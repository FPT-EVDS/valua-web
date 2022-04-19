/* eslint-disable react/require-default-props */

import { Close } from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import LoadingIndicator from 'components/LoadingIndicator';
import SemesterDropdown from 'components/SemesterDropdown';
import SlideTransition from 'components/SlideTransition';
import SubjectSemesterDropdown from 'components/SubjectSemesterDropdown';
import { autoAssignShiftsSchema } from 'configs/validations';
import { add, format, isAfter } from 'date-fns';
import AutoAssignShiftDto from 'dtos/autoAssignShift.dto';
import { autoAssignShifts } from 'features/shift/shiftSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import SubjectSemester from 'models/subjectSemester.model';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AutoAssignDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const formatter = 'dd/MM/yyyy';
  const { isLoading } = useAppSelector(state => state.shift);
  const [semester, setSemester] = useState<Semester | null>(null);
  const formik = useFormik({
    initialValues: {
      semester,
      fromDate: add(new Date(), { days: 2 }),
      durationInDays: '10',
      subjectSemesters: [] as Array<SubjectSemester>,
    },
    validationSchema: autoAssignShiftsSchema,
    onSubmit: async (payload: AutoAssignShiftDto) => {
      if (payload.semester) {
        try {
          const submittedPayload: AutoAssignShiftDto = {
            semester: { semesterId: payload.semester.semesterId },
            durationInDays: String(payload.durationInDays),
            fromDate: format(new Date(payload.fromDate), 'yyyy/MM/dd'),
            subjectSemesters: payload.subjectSemesters.map(
              ({ subjectSemesterId }) => ({
                subjectSemesterId,
              }),
            ),
          };
          const result = await dispatch(autoAssignShifts(submittedPayload));
          unwrapResult(result);
          showSuccessMessage('Create shifts successfully');
          formik.resetForm();
          handleClose();
        } catch (error) {
          showErrorMessage(error);
        }
      }
    },
  });

  const handleChangeFromDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('fromDate', selectedDate);
  };

  const handleChangeSemester = async (
    _selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    const shiftSemester = _selectedSemester as Semester;
    if (shiftSemester) {
      setSemester(shiftSemester);
      await formik.setFieldValue('semester', _selectedSemester);
      await (isAfter(new Date(shiftSemester.beginDate), new Date())
        ? handleChangeFromDate(shiftSemester.beginDate)
        : handleChangeFromDate(add(new Date(), { days: 2 })));
      await formik.setFieldValue(
        'subjectSemesters',
        [] as Array<SubjectSemester>,
      );
    } else {
      setSemester(semester);
    }
  };

  const handleChangeSubjects = async (payload: SubjectSemester[]) => {
    await formik.setFieldValue('subjectSemesters', payload);
  };

  useEffect(() => {
    handleChangeSemester(semester).catch(error => showErrorMessage(error));
  }, [semester]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
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
          <Typography variant="h6">Auto assign shifts</Typography>
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
            <Grid item xs={12}>
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
                <DatePicker
                  label="From date"
                  minDate={
                    semester !== null ? new Date(semester.beginDate) : undefined
                  }
                  maxDate={
                    semester !== null ? new Date(semester.endDate) : undefined
                  }
                  value={formik.values.fromDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={handleChangeFromDate}
                  renderInput={params => (
                    <TextField
                      {...params}
                      name="fromDate"
                      margin="dense"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={
                        formik.touched.fromDate &&
                        Boolean(formik.errors.fromDate)
                      }
                      helperText={
                        formik.touched.fromDate && formik.errors.fromDate
                      }
                    />
                  )}
                />
                <TextField
                  label="Duration in days"
                  name="durationInDays"
                  type="number"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={
                    formik.touched.durationInDays &&
                    Boolean(formik.errors.durationInDays)
                  }
                  helperText={
                    formik.touched.durationInDays &&
                    formik.errors.durationInDays
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">day(s)</InputAdornment>
                    ),
                    inputProps: { min: 1, max: 6 },
                  }}
                  value={formik.values.durationInDays}
                  onChange={formik.handleChange}
                />
                {formik.values.semester?.semesterId ? (
                  <SubjectSemesterDropdown
                    value={formik.values.subjectSemesters}
                    semesterId={formik.values.semester.semesterId}
                    onChange={handleChangeSubjects}
                    name="subjectSemesters"
                    error={
                      formik.touched.subjectSemesters &&
                      Boolean(formik.errors.subjectSemesters)
                    }
                    helperText={
                      formik.touched.subjectSemesters &&
                      String(formik.errors.subjectSemesters ?? '')
                    }
                  />
                ) : (
                  <LoadingIndicator />
                )}

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

export default AutoAssignDialog;
