import { Close, Subject } from '@mui/icons-material';
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
import { SubjectDto } from 'dtos/subject.dto';
import { addSubject } from 'features/subject/subjectsSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';

interface Props {
  title: string;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValues?: SubjectDto;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

const SubjectDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  initialValues = {
    subjectId: null,
    subjectCode: '',
    subjectName: '',
  },
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.subjects.isLoading);
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: SubjectDto) => {
      try {
        const result = await dispatch(addSubject(payload));
        unwrapResult(result);
        enqueueSnackbar('Add subject success', {
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
          {title}
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
              <Subject fontSize="large" />
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
            Create
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SubjectDetailDialog;
