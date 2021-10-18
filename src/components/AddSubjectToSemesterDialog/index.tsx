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
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SemesterSubjectDropdown from 'components/SemesterSubjectDropdown';
import addSubjectsSchema from 'configs/validations/addSubjectsSchema';
import { AddSubjectToSemesterDto } from 'dtos/addSubjectToSemester.dto';
import { addSubjectsToSemester } from 'features/semester/detailSemesterSlice';
import { useFormik } from 'formik';
import Subject from 'models/subject.model';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

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
      TransitionComponent={Transition}
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
          <SemesterSubjectDropdown
            touched={formik.touched}
            errors={formik.errors}
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
