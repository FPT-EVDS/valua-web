import { Edit, EditOff } from '@mui/icons-material';
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
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import genders from 'configs/constants/genders.constant';
import { appUserSchema } from 'configs/validations';
import { updateUserProfile } from 'features/auth/authSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import User from 'models/user.model';
import React, { useEffect, useState } from 'react';

interface Props {
  user: User;
  isLoading: boolean;
}

const ProfileDetailCard = ({ user, isLoading }: Props) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: User = { ...user };
  const formik = useFormik({
    initialValues,
    validationSchema: appUserSchema,
    onSubmit: async (payload: User) => {
      try {
        const data = {
          ...payload,
        };
        const result = await dispatch(updateUserProfile(data));
        unwrapResult(result);
        showSuccessMessage('Update profile successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const refreshFormValues = async () => {
    if (user) {
      await formik.setValues({
        ...user,
      });
    }
  };

  const handleChangeGender = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('gender', event.target.value);
  };

  const handleChangeBirthDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('birthdate', selectedDate);
  };

  useEffect(() => {
    refreshFormValues().catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Basic Profile
          </Typography>
        }
        action={
          <IconButton onClick={() => setIsEditable(prevState => !prevState)}>
            {isEditable ? (
              <EditOff sx={{ fontSize: 20 }} />
            ) : (
              <Edit sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                autoFocus
                name="email"
                margin="dense"
                label="Email"
                fullWidth
                variant="outlined"
                value={formik.values.email}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                autoFocus
                name="fullName"
                margin="dense"
                label="Fullname"
                fullWidth
                variant="outlined"
                value={formik.values.fullName}
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Birthdate"
                value={formik.values.birthdate}
                inputFormat="dd/MM/yyyy"
                onChange={date => handleChangeBirthDate(date)}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    name="birthdate"
                    autoFocus
                    margin="dense"
                    fullWidth
                    disabled={!isEditable}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.birthdate &&
                      Boolean(formik.errors.birthdate)
                    }
                    helperText={
                      formik.touched.birthdate && formik.errors.birthdate
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="phoneNumber"
                autoFocus
                margin="dense"
                disabled={!isEditable}
                label="Phone number"
                fullWidth
                value={formik.values.phoneNumber}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
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
                name="address"
                autoFocus
                margin="dense"
                label="Address"
                fullWidth
                value={formik.values.address}
                variant="outlined"
                disabled={!isEditable}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        <>
          <Divider />
          <CardActions>
            <LoadingButton
              disabled={!isEditable}
              loading={isLoading}
              type="submit"
              variant="contained"
            >
              Update profile
            </LoadingButton>
          </CardActions>
        </>
      </Box>
    </Card>
  );
};

export default ProfileDetailCard;
