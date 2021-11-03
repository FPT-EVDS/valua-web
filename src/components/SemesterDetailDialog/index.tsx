import { Close, School } from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
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
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SlideTransition from 'components/SlideTransition';
import { semesterSchema } from 'configs/validations';
import { add } from 'date-fns';
import SemesterDto from 'dtos/semester.dto';
import { addSemester, updateSemester } from 'features/semester/semestersSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValues?: SemesterDto;
  isUpdate: boolean;
}

const SemesterDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues = {
    semesterId: null,
    semesterName: '',
    beginDate: new Date(),
    endDate: add(new Date(), { months: 1 }),
  },
  isUpdate,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.semesters.isLoading);
  const formik = useFormik({
    initialValues,
    validationSchema: semesterSchema,
    onSubmit: async (payload: SemesterDto) => {
      try {
        const message = isUpdate
          ? `Update semester ${String(payload.semesterName)} success`
          : 'Add semester success';
        const result = isUpdate
          ? await dispatch(updateSemester(payload))
          : await dispatch(addSemester(payload));
        unwrapResult(result);
        enqueueSnackbar(message, {
          variant: 'success',
          preventDuplicate: true,
        });
        formik.resetForm();
        handleClose();
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const refreshForm = async (values: SemesterDto) => formik.setValues(values);

  useEffect(() => {
    refreshForm(initialValues).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const handleChangeBeginDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('beginDate', selectedDate);
  };

  const handleChangeEndDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('endDate', selectedDate);
  };

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
          {isUpdate ? 'Update semester' : 'Create semester'}
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
              <School fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="semesterName"
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={formik.values.semesterName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.semesterName &&
                  Boolean(formik.errors.semesterName)
                }
                helperText={
                  formik.touched.semesterName && formik.errors.semesterName
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Begin date"
                value={formik.values.beginDate}
                inputFormat="dd/MM/yyyy"
                onChange={handleChangeBeginDate}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="beginDate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.beginDate &&
                      Boolean(formik.errors.beginDate)
                    }
                    helperText={
                      formik.touched.beginDate && formik.errors.beginDate
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="End date"
                value={formik.values.endDate}
                inputFormat="dd/MM/yyyy"
                onChange={handleChangeEndDate}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="endDate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.endDate && Boolean(formik.errors.endDate)
                    }
                    helperText={formik.touched.endDate && formik.errors.endDate}
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
            {isUpdate ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SemesterDetailDialog;
