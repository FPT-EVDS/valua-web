import { Close } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import { Box, Grid, IconButton, MenuItem, Slide } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { TransitionProps } from '@mui/material/transitions';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import AppUserDto from 'dtos/appUser.dto';
import Roles from 'enums/role.enum';
import { addAccount } from 'features/account/accountSlice';
import { useFormik } from 'formik';
import Role from 'models/role.model';
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
    imageUrl: null,
    phoneNumber: '',
    roleID: 1,
    studentId: '',
    classCode: '',
  },
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useAppDispatch();
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
          studentId: payload.studentId?.length === 0 ? null : payload.studentId,
          classCode: payload.classCode?.length === 0 ? null : payload.classCode,
        };
        const result = await dispatch(addAccount(data));
        unwrapResult(result);
      } catch (error) {
        setErrorMessage(error);
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
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item sm={12}>
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
            <Grid item md={6}>
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
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item md={6}>
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
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item md={6}>
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
            <Grid item md={6}>
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
                onChange={formik.handleChange}
              />
            </Grid>
            {formik.values.roleID === 3 && (
              <>
                <Grid item md={6}>
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
        <DialogActions>
          <Button type="submit">Create</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AccountDetailDialog;
