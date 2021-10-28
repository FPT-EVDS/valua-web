import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddSemesterSubjectsDropdown from 'components/AddSemesterSubjectDropdown';
import SlideTransition from 'components/SlideTransition';
import addSubjectsSchema from 'configs/validations/addSubjectsSchema';
import AddSubjectToSemesterDto from 'dtos/addSubjectToSemester.dto';
import { addSubjectsToSemester } from 'features/semester/detailSemesterSlice';
import { useFormik } from 'formik';
import Subject from 'models/subject.model';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddSubjectToSemesterDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const { semester, canAddSubjects } = useAppSelector(
    state => state.detailSemester,
  );

  const formik = useFormik({
    initialValues: {
      semesterId: semester ? semester.semesterId : '',
      subjects: [],
    },
    validationSchema: addSubjectsSchema,
    onSubmit: async (payload: AddSubjectToSemesterDto) => {
      try {
        const result = await dispatch(
          addSubjectsToSemester({
            ...payload,
            semesterId: String(semester?.semesterId),
          }),
        );
        unwrapResult(result);
        const message = `Add ${
          formik.values.subjects.length
        } subjects to ${String(semester?.semesterName)} success`;
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

  const handleChangeSubjects = async (selectedSubjects: Subject[] | null) => {
    await formik.setFieldValue('subjects', selectedSubjects);
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
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">
            Add subjects to {semester?.semesterName}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" pb={2} onSubmit={formik.handleSubmit}>
        <DialogContent>
          <AddSemesterSubjectsDropdown
            error={Boolean(formik.errors.subjects)}
            helperText={String(formik.errors.subjects)}
            semesterId={String(semester?.semesterId)}
            onChange={value => handleChangeSubjects(value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            disabled={!canAddSubjects}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddSubjectToSemesterDialog;
