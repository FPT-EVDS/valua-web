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
import LoadingIndicator from 'components/LoadingIndicator';
import SlideTransition from 'components/SlideTransition';
import { configSchema } from 'configs/validations';
import Role from 'enums/role.enum';
import { updateConfig } from 'features/config/configSlice';
import { FormikErrors, useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import { ManagerConfig, ShiftManagerConfig } from 'models/config.model';
import React from 'react';

import ManagerSetting from './ManagerSetting';
import ShiftManagerSetting from './ShiftManagerSetting';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const SettingDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { user } = useAppSelector(state => state.auth);
  const { config, isLoading } = useAppSelector(state => state.config);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { config, role: user?.role },
    validationSchema: configSchema,
    enableReinitialize: true,
    onSubmit: async payload => {
      if (payload.config) {
        try {
          const result = await dispatch(updateConfig(payload.config));
          unwrapResult(result);
          showSuccessMessage('Update settings successfully');
        } catch (error) {
          showErrorMessage(error);
        }
      }
    },
  });

  const handleCloseDialog = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
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
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" pb={2} noValidate onSubmit={formik.handleSubmit}>
        <DialogContent>
          {config ? (
            user?.role === Role.ShiftManager ? (
              <ShiftManagerSetting
                values={formik.values.config as ShiftManagerConfig}
                errors={
                  formik.errors.config as
                    | FormikErrors<ShiftManagerConfig>
                    | undefined
                }
                handleChange={formik.handleChange}
              />
            ) : (
              <ManagerSetting
                values={formik.values.config as ManagerConfig}
                errors={
                  formik.errors.config as
                    | FormikErrors<ManagerConfig>
                    | undefined
                }
                handleChange={formik.handleChange}
                handleChangeFieldValues={formik.setFieldValue}
              />
            )
          ) : isLoading ? (
            <LoadingIndicator />
          ) : (
            'Something wrong'
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            loading={isLoading}
            disabled={
              isLoading || config === null || String(config).length === 0
            }
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default SettingDialog;
