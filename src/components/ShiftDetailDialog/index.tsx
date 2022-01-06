import { Close, Event } from '@mui/icons-material';
import { DateTimePicker, LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SemesterDropdown from 'components/SemesterDropdown';
import SlideTransition from 'components/SlideTransition';
import { shiftSchema } from 'configs/validations';
import { add } from 'date-fns';
import ShiftDto from 'dtos/shift.dto';
import { addShift } from 'features/shift/shiftSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValues?: ShiftDto;
}

const ShiftDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues = {
    shiftId: null,
    semester: null,
    beginTime: add(new Date(), { days: 1, hours: 1 }),
    finishTime: add(new Date(), { days: 1, hours: 2 }),
  },
}) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const { isLoading, semester } = useAppSelector(state => state.shift);
  const formik = useFormik({
    initialValues: { ...initialValues, semester },
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
    selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    await formik.setFieldValue('semester', selectedSemester);
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
          <Typography variant="h6">Create shift</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit} pb={2}>
        <DialogContent>
          <Box display="flex" justifyContent="center">
            <Avatar
              sx={{
                bgcolor: '#1890ff',
                mb: 2,
                width: 150,
                height: 150,
                borderRadius: '3px',
              }}
              variant="square"
            >
              <Event fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SemesterDropdown
                value={formik.values.semester}
                isEditable
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
                onChange={handleChangeBeginTime}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="beginTime"
                    autoFocus
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
            </Grid>
            <Grid item xs={12}>
              <DateTimePicker
                label="End time"
                value={formik.values.finishTime}
                inputFormat="dd/MM/yyyy HH:mm"
                onChange={handleChangeFinishTime}
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            loading={isLoading}
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ShiftDetailDialog;
