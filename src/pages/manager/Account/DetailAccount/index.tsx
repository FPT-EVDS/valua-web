import {
  AccountCircle,
  ChevronLeft,
  Edit,
  EditOff,
  Email,
  Home,
  Image,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import OverviewCard from 'components/OverviewCard';
import genders from 'configs/constants/genders.constant';
import accountRoles from 'configs/constants/roles.constant';
import AppUserDto from 'dtos/appUser.dto';
import { updateAccount } from 'features/account/accountsSlice';
import { getAccount } from 'features/account/detailAccountSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailAccountPage = () => {
  const dispatch = useAppDispatch();
  const account = useAppSelector(state => state.detailAccount.account);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const query = useQuery();
  const { id } = useParams<ParamProps>();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: AppUserDto = {
    address: '',
    birthdate: new Date(),
    email: '',
    fullName: '',
    gender: 0,
    imageUrl: '',
    phoneNumber: '',
    userRole: accountRoles[0],
    studentId: '',
    classCode: '',
  };

  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: AppUserDto) => {
      try {
        const data = {
          ...payload,
          imageUrl: payload.imageUrl?.length === 0 ? null : payload.imageUrl,
          studentId: payload.studentId?.length === 0 ? null : payload.studentId,
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

  const refreshFormValues = async () => {
    if (account) {
      await formik.setValues({
        ...account,
        userRole:
          accountRoles[
            accountRoles.findIndex(role => role.roleID === account.role.roleID)
          ],
      });
    }
  };

  useEffect(() => {
    refreshFormValues().catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const handleChangeGender = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('gender', event.target.value);
  };

  const handleChangeBirthdate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('birthdate', selectedDate);
  };

  const fetchAccount = async (appUserId: string) => {
    const actionResult = await dispatch(getAccount(appUserId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchAccount(id).catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const GroupButtons = () => (
    <>
      <Button variant="text">Upload picture</Button>
      <Button variant="text" sx={{ color: grey[700] }}>
        Reset password
      </Button>
      <Button variant="text" color="error">
        Disable account
      </Button>
    </>
  );

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/manager/account')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to account page</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        <Grid item xs={12} md={9} lg={4}>
          {account && (
            <OverviewCard account={account} actionButtons={<GroupButtons />} />
          )}
        </Grid>
        <Grid item xs={12} lg={8}>
          <Card sx={{ minWidth: 275 }} elevation={2}>
            <CardHeader
              title={
                <Typography
                  sx={{ fontWeight: 'medium', fontSize: 20 }}
                  variant="h5"
                  gutterBottom
                >
                  Basic profile
                </Typography>
              }
              action={
                <IconButton
                  onClick={() => setIsEditable(prevState => !prevState)}
                >
                  {isEditable ? (
                    <EditOff sx={{ fontSize: 20 }} />
                  ) : (
                    <Edit sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              }
            />
            <Box component="form" onSubmit={formik.handleSubmit} pb={2}>
              <CardContent>
                <Grid container spacing={2}>
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
                      disabled={!isEditable}
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
                  {formik.values.userRole.roleID === 3 && (
                    <>
                      <Grid item xs={12} md={6}>
                        <TextField
                          name="studentId"
                          autoFocus
                          margin="dense"
                          label="Student ID"
                          disabled={!isEditable}
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
                          disabled={!isEditable}
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
              </CardContent>
              <Divider />
              <CardActions>
                <LoadingButton type="submit" variant="contained">
                  Update account
                </LoadingButton>
              </CardActions>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailAccountPage;
