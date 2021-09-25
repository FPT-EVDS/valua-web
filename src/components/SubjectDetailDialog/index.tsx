import { Class, Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SubjectDto from 'dtos/subject.dto';
import { addSubject, updateSubject } from 'features/subject/subjectsSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValues?: SubjectDto;
  isUpdate: boolean;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

const SubjectDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues = {
    subjectId: null,
    subjectCode: '',
    subjectName: '',
  },
  isUpdate,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.subjects.isLoading);
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: SubjectDto) => {
      try {
        const message = isUpdate
          ? `Update subject ${String(payload.subjectName)} success`
          : 'Add subject success';
        const result = isUpdate
          ? await dispatch(updateSubject(payload))
          : await dispatch(addSubject(payload));
        unwrapResult(result);
        enqueueSnackbar(message, {
          variant: 'success',
          preventDuplicate: true,
        });
        formik.resetForm();
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const refreshForm = async (values: SubjectDto) => formik.setValues(values);

  useEffect(() => {
    refreshForm(initialValues).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

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
          {isUpdate ? 'Update subject' : 'Create subject'}
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
              <Class fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="subjectCode"
                margin="dense"
                label="Subject Code"
                fullWidth
                variant="outlined"
                value={formik.values.subjectCode}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="subjectName"
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={formik.values.subjectName}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
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

export default SubjectDetailDialog;
