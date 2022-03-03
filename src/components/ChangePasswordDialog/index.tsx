import { Close, Lock } from '@mui/icons-material';
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
import { changePasswordSchema } from 'configs/validations';
import ChangePasswordDto from 'dtos/changePassword.dto';
import { changePassword } from 'features/auth/authSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const ChangePasswordDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const { isLoading } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: changePasswordSchema,
    onSubmit: async ({ currentPassword, newPassword }) => {
      try {
        const result = await dispatch(
          changePassword({
            currentPassword,
            newPassword,
          }),
        );
        unwrapResult(result);
        showSuccessMessage('Change password successfully');
        formik.resetForm();
        handleClose();
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const handleModalClose = () => {
    formik.resetForm();
    handleClose();
  };

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
          Update password
          <IconButton onClick={handleModalClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit} pb={2} noValidate>
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
              <Lock fontSize="large" />
            </Avatar>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                required
                type="password"
                name="currentPassword"
                margin="dense"
                label="Current password"
                fullWidth
                variant="outlined"
                value={formik.values.currentPassword}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.currentPassword &&
                  Boolean(formik.errors.currentPassword)
                }
                helperText={
                  formik.touched.currentPassword &&
                  formik.errors.currentPassword
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="newPassword"
                type="password"
                margin="dense"
                label="New password"
                fullWidth
                variant="outlined"
                value={formik.values.newPassword}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.newPassword &&
                  Boolean(formik.errors.newPassword)
                }
                helperText={
                  formik.touched.newPassword && formik.errors.newPassword
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="confirmPassword"
                margin="dense"
                type="password"
                label="Retype your new password"
                fullWidth
                variant="outlined"
                value={formik.values.confirmPassword}
                InputLabelProps={{
                  shrink: true,
                }}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
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
            Update
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ChangePasswordDialog;
