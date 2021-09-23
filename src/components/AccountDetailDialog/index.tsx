import {
  AccountCircle,
  Close,
  Email,
  Home,
  Image,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AppUserDto from 'dtos/appUser.dto';
import Roles from 'enums/role.enum';
import { addAccount } from 'features/account/accountSlice';
import { useFormik } from 'formik';
import Role from 'models/role.model';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

interface Props {
  title: string;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initValues?: AppUserDto;
}

const Transition = React.forwardRef(
  (props: TransitionProps, ref: React.Ref<unknown>) => (
    <Slide direction="up" ref={ref} {...props} />
  ),
);

// FIXME: Should be fetch from be
const roles: Role[] = [
  {
    roleID: 1,
    roleName: Roles.ShiftManager,
  },
  {
    roleID: 2,
    roleName: Roles.Staff,
  },
  {
    roleID: 3,
    roleName: Roles.Examinee,
  },
];

const genders = [
  {
    value: 0,
    label: 'Male',
  },
  {
    value: 1,
    label: 'Female',
  },
];

const AccountDetailDialog: React.FC<Props> = ({
  open,
  handleClose,
  title,
  initValues = {
    address: '',
    birthdate: new Date(),
    email: '',
    fullName: '',
    gender: 0,
    imageUrl: '',
    phoneNumber: '',
    roleID: 1,
    studentId: '',
    classCode: '',
  },
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);
  const formik = useFormik({
    initialValues: initValues,
    onSubmit: async (payload: AppUserDto) => {
      try {
        // FIXME: BAD PRACTICES
        const data = {
          ...payload,
          userRole: {
            roleID: payload.roleID,
          },
          imageUrl: payload.imageUrl?.length === 0 ? null : payload.imageUrl,
          studentId: payload.studentId?.length === 0 ? null : payload.studentId,
          classCode: payload.classCode?.length === 0 ? null : payload.classCode,
        };
        const result = await dispatch(addAccount(data));
        unwrapResult(result);
        enqueueSnackbar('Add account success', {
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

  const handleChangeRole = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('roleID', event.target.value);
  };

  const handleChangeGender = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('gender', event.target.value);
  };

  const handleChangeBirthdate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('birthdate', selectedDate);
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
          {title}
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" onSubmit={formik.handleSubmit} pb={2}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="userRole"
                select
                margin="dense"
                label="Role"
                fullWidth
                value={formik.values.roleID}
                variant="outlined"
                onChange={handleChangeRole}
              >
                {roles.map(option => (
                  <MenuItem key={option.roleID} value={option.roleID}>
                    {option.roleName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="fullName"
                margin="dense"
                label="Full name"
                fullWidth
                variant="outlined"
                value={formik.values.fullName}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="gender"
                select
                margin="dense"
                label="Gender"
                fullWidth
                value={formik.values.gender}
                variant="outlined"
                onChange={handleChangeGender}
              >
                {genders.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                autoFocus
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={formik.values.email}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Birthdate"
                value={formik.values.birthdate}
                inputFormat="dd/MM/yyyy"
                onChange={date => handleChangeBirthdate(date)}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="birthdate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phoneNumber"
                autoFocus
                margin="dense"
                label="Phone number"
                value={formik.values.phoneNumber}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                autoFocus
                margin="dense"
                label="Address"
                fullWidth
                value={formik.values.address}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Home />
                    </InputAdornment>
                  ),
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="imageUrl"
                autoFocus
                margin="dense"
                label="Avatar"
                fullWidth
                value={formik.values.imageUrl}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image />
                    </InputAdornment>
                  ),
                }}
                helperText="Backend chua xu ly anh nên chịu khó up link ^^"
                onChange={formik.handleChange}
              />
            </Grid>
            {formik.values.roleID === 3 && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="studentId"
                    autoFocus
                    margin="dense"
                    label="Student ID"
                    fullWidth
                    value={formik.values.studentId}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item md={6}>
                  <TextField
                    name="classCode"
                    autoFocus
                    margin="dense"
                    label="Class"
                    fullWidth
                    variant="outlined"
                    value={formik.values.classCode}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </>
            )}
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

export default AccountDetailDialog;
