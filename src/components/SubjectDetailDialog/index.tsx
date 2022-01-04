/* eslint-disable react/require-default-props */
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
  TextField,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import SlideTransition from 'components/SlideTransition';
import ToolDropdown from 'components/ToolDropdown';
import { subjectSchema } from 'configs/validations';
import SubjectDto from 'dtos/subject.dto';
import { addSubject, updateSubject } from 'features/subject/subjectsSlice';
import { useFormik } from 'formik';
import Tool from 'models/tool.model';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  initialValues?: SubjectDto;
  isActive: boolean;
  isUpdate: boolean;
}

const SubjectDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues = {
    subjectId: null,
    subjectCode: '',
    subjectName: '',
    tools: [],
  },
  isUpdate,
  isActive,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.subjects.isLoading);
  const formik = useFormik({
    initialValues,
    validationSchema: subjectSchema,
    onSubmit: async (payload: SubjectDto) => {
      try {
        const message = isUpdate
          ? `Update subject ${String(payload.subjectCode)} successfully`
          : 'Create subject successfully';
        const result = isUpdate
          ? await dispatch(updateSubject(payload))
          : await dispatch(addSubject(payload));
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

  const handleModalClose = () => {
    formik.resetForm();
    handleClose();
  };

  const handleChangeTools = async (selectedTools: Tool[] | null) => {
    await formik.setFieldValue('tools', selectedTools);
  };

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
      onClose={handleModalClose}
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
          {!isActive
            ? `${formik.values.subjectCode}'s detail`
            : isUpdate
            ? 'Update subject'
            : 'Create subject'}
          <IconButton onClick={handleModalClose}>
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
                required
                name="subjectCode"
                margin="dense"
                label="Subject code"
                fullWidth
                variant="outlined"
                value={formik.values.subjectCode}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!isActive}
                error={
                  formik.touched.subjectCode &&
                  Boolean(formik.errors.subjectCode)
                }
                helperText={
                  formik.touched.subjectCode && formik.errors.subjectCode
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                name="subjectName"
                margin="dense"
                label="Name"
                fullWidth
                disabled={!isActive}
                variant="outlined"
                value={formik.values.subjectName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.subjectName &&
                  Boolean(formik.errors.subjectName)
                }
                helperText={
                  formik.touched.subjectName && formik.errors.subjectName
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <ToolDropdown
                disabled={!isActive}
                error={Boolean(formik.errors.tools)}
                helperText={String(formik.errors.tools)}
                onChange={value => handleChangeTools(value)}
                value={formik.values.tools ?? []}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {isActive && (
            <LoadingButton
              type="submit"
              variant="contained"
              sx={{ width: 150 }}
              loading={isLoading}
            >
              {isUpdate ? 'Update' : 'Create'}
            </LoadingButton>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SubjectDetailDialog;
