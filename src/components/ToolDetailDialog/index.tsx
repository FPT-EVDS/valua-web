/* eslint-disable react/require-default-props */
import { Build, Close } from '@mui/icons-material';
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
import { toolSchema } from 'configs/validations';
import ToolDto from 'dtos/tool.dto';
import { addTool, updateTool } from 'features/tool/toolsSlice';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  initialValues?: ToolDto;
  isActive: boolean;
  isUpdate: boolean;
}

const ToolDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  initialValues = {
    toolId: null,
    toolCode: '',
    toolName: '',
  },
  isUpdate,
  isActive,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.tools.isLoading);
  const formik = useFormik({
    initialValues,
    validationSchema: toolSchema,
    onSubmit: async (payload: ToolDto) => {
      try {
        const message = isUpdate
          ? `Update tool ${String(payload.toolCode)} success`
          : 'Create tool success';
        const result = isUpdate
          ? await dispatch(updateTool(payload))
          : await dispatch(addTool(payload));
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

  const refreshForm = async (values: ToolDto) => formik.setValues(values);

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
            ? `${formik.values.toolCode}'s detail`
            : isUpdate
            ? 'Update tool'
            : 'Create tool'}
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
              <Build fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="toolCode"
                margin="dense"
                label="Tool code"
                fullWidth
                variant="outlined"
                value={formik.values.toolCode}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!isActive}
                error={
                  formik.touched.toolCode && Boolean(formik.errors.toolCode)
                }
                helperText={formik.touched.toolCode && formik.errors.toolCode}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="toolName"
                margin="dense"
                label="Name"
                fullWidth
                disabled={!isActive}
                variant="outlined"
                value={formik.values.toolName}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.toolName && Boolean(formik.errors.toolName)
                }
                helperText={formik.touched.toolName && formik.errors.toolName}
                onChange={formik.handleChange}
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

export default ToolDetailDialog;
