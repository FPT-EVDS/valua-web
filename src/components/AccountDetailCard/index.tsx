import {
  AccountCircle,
  Edit,
  EditOff,
  Email,
  Home,
  Image,
  PermIdentity,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import genders from 'configs/constants/genders.constant';
import accountRoles from 'configs/constants/roles.constant';
import { accountSchema } from 'configs/validations';
import AppUserDto from 'dtos/appUser.dto';
import { updateAccount } from 'features/account/detailAccountSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Account from 'models/account.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface Props {
  account: Account;
  isLoading: boolean;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const AccountDetailCard = ({ account, isLoading }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: AppUserDto = {
    ...account,
    userRole: account.role,
    companyId: account.companyId || '',
  };
  const formik = useFormik({
    initialValues,
    validationSchema: accountSchema,
    onSubmit: async (payload: AppUserDto) => {
      try {
        const data = {
          ...payload,
          imageUrl: payload.imageUrl?.length === 0 ? null : payload.imageUrl,
          classCode: payload.classCode?.length === 0 ? null : payload.classCode,
        };
        const result = await dispatch(updateAccount(data));
        unwrapResult(result);
        enqueueSnackbar('Update account success', {
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

  const handleChangeGender = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('gender', event.target.value);
  };

  const handleChangeBirthdate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('birthdate', selectedDate);
  };

  const refreshFormValues = async () => {
    if (account) {
      const roleIndex = accountRoles.findIndex(
        role => role.roleID === account.role.roleID,
      );
      const userRole = accountRoles[roleIndex] || {
        roleID: 0,
        name: 'Manager',
      };
      await formik.setValues({
        ...account,
        userRole,
        companyId: account.companyId || '',
      });
    }
  };

  useEffect(() => {
    refreshFormValues().catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Account information
          </Typography>
        }
        action={
          account?.isActive && (
            <IconButton onClick={() => setIsEditable(prevState => !prevState)}>
              {isEditable ? (
                <EditOff sx={{ fontSize: 20 }} />
              ) : (
                <Edit sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          )
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="companyId"
                autoFocus
                margin="dense"
                label={
                  formik.values.userRole.roleID === 3
                    ? 'Student ID'
                    : 'Company ID'
                }
                fullWidth
                value={formik.values.companyId}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PermIdentity />
                    </InputAdornment>
                  ),
                }}
                error={
                  formik.touched.companyId && Boolean(formik.errors.companyId)
                }
                helperText={formik.touched.companyId && formik.errors.companyId}
                onChange={formik.handleChange}
              />
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
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                onChange={formik.handleChange}
                disabled={!isEditable}
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
                disabled={!isEditable}
                error={formik.touched.gender && Boolean(formik.errors.gender)}
                helperText={formik.touched.gender && formik.errors.gender}
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
                disabled={!isEditable}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
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
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="birthdate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
                    error={
                      formik.touched.birthdate &&
                      Boolean(formik.errors.birthdate)
                    }
                    helperText={
                      formik.touched.birthdate && formik.errors.birthdate
                    }
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
                disabled={!isEditable}
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
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="address"
                autoFocus
                margin="dense"
                disabled={!isEditable}
                label="Address"
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
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
            {formik.values.userRole.roleID === 3 && (
              <>
                <Grid item xs={12}>
                  <TextField
                    name="classCode"
                    autoFocus
                    margin="dense"
                    label="Class code"
                    fullWidth
                    disabled
                    variant="outlined"
                    value={formik.values.classCode}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.classCode &&
                      Boolean(formik.errors.classCode)
                    }
                    helperText={
                      formik.touched.classCode && formik.errors.classCode
                    }
                    onChange={formik.handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
        {account?.isActive && (
          <>
            <Divider />
            <CardActions>
              <LoadingButton
                disabled={!isEditable}
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Update account
              </LoadingButton>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

export default AccountDetailCard;
