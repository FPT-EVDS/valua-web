import {
  AccountCircle,
  ChevronLeft,
  Close,
  Email,
  Home,
  PermIdentity,
  Phone,
} from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Avatar,
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
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import examineeIcon from 'assets/images/examinee.png';
import shiftManagerIcon from 'assets/images/shift-manager.png';
import staffIcon from 'assets/images/staff.png';
import AvatarFilePicker from 'components/AvatarFilePicker';
import ImagesDropzone from 'components/ImagesDropzone';
import SlideTransition from 'components/SlideTransition';
import genders from 'configs/constants/genders.constant';
import accountRoles from 'configs/constants/roles.constant';
import { accountSchema } from 'configs/validations';
import { sub } from 'date-fns';
import AppUserDto from 'dtos/appUser.dto';
import { addAccount } from 'features/account/accountsSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Role from 'models/role.model';
import React, { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

interface AvatarWithTextProps {
  src: string;
  color: string;
  title: string;
  role: Role;
  // eslint-disable-next-line react/require-default-props
  handleClick?: () => void;
}

const AvatarWithText = ({
  src,
  color,
  title,
  handleClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...props
}: AvatarWithTextProps) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    onClick={handleClick}
    sx={{ cursor: 'pointer' }}
  >
    <Avatar
      src={src}
      alt={title}
      sx={{ width: 96, height: 96, bgcolor: color, marginBottom: 2 }}
    />
    <Typography>{title}</Typography>
  </Box>
);

const rolesProps: AvatarWithTextProps[] = [
  {
    src: staffIcon,
    color: '#13C2C2',
    title: 'Staff',
    role: accountRoles[1],
  },
  {
    src: shiftManagerIcon,
    color: '#FADB14',
    title: 'Shift Manager',
    role: accountRoles[0],
  },
  {
    src: examineeIcon,
    color: '#FF4D4F',
    title: 'Examinee',
    role: accountRoles[2],
  },
];

// eslint-disable-next-line sonarjs/cognitive-complexity
const AccountDetailDialog: React.FC<Props> = ({ open, handleClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);
  const formik = useFormik({
    initialValues: {
      appUserId: null,
      address: '',
      birthdate: sub(new Date(), { years: 7 }),
      email: '',
      fullName: '',
      gender: 0,
      imageUrl: '',
      phoneNumber: '',
      userRole: accountRoles[0],
      companyId: '',
      classCode: '',
      image: null,
      imageFiles: null as FileList | null,
    },
    validationSchema: accountSchema,
    onSubmit: async (payload: AppUserDto) => {
      try {
        const accountData = {
          ...payload,
          imageUrl: payload.imageUrl?.length === 0 ? null : payload.imageUrl,
          classCode: payload.classCode?.length === 0 ? null : payload.classCode,
        };
        const { image, imageFiles } = formik.values;
        const formData = new FormData();
        const accountDataBlob = new Blob([JSON.stringify(accountData)], {
          type: 'application/json',
        });
        formData.append('account', accountDataBlob);
        if (image) formData.append('image', image as unknown as Blob);
        if (imageFiles) {
          // eslint-disable-next-line unicorn/no-for-loop
          for (let i = 0; i < imageFiles.length; i += 1) {
            formData.append('imageFiles', imageFiles[i]);
          }
        }
        const result = await dispatch(addAccount(formData));
        unwrapResult(result);
        showSuccessMessage('Create account successfully');
        formik.resetForm();
        setCurrentStep(0);
        handleClose();
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const handleCloseModal = () => {
    setCurrentStep(0);
    formik.resetForm();
    handleClose();
  };

  const handleChangeGender = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await formik.setFieldValue('gender', event.target.value);
  };

  const handleChangeBirthdate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('birthdate', selectedDate);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      await formik.setFieldValue('image', event.target.files[0]);
    }
  };

  const handleImagesChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      await formik.setFieldValue('imageFiles', event.target.files);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullWidth
      maxWidth={currentStep === 0 ? 'sm' : 'md'}
      TransitionComponent={SlideTransition}
      PaperProps={{ sx: { overflowX: 'hidden' } }}
    >
      {currentStep === 0 && (
        <>
          <Slide
            direction="left"
            in={Boolean(currentStep === 0)}
            timeout={{
              enter: 500,
              exit: currentStep === 0 ? 1 : 400,
            }}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <DialogTitle>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <IconButton sx={{ visibility: 'hidden' }} />
                  <Typography variant="h6">Choose account role</Typography>
                  <IconButton onClick={handleCloseModal}>
                    <Close />
                  </IconButton>
                </Grid>
              </DialogTitle>
              <Box pb={2}>
                <DialogContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Grid container spacing={2}>
                    {rolesProps.map(props => (
                      <Grid item sm={4} xs={12} key={props.title}>
                        <AvatarWithText
                          {...props}
                          handleClick={async () => {
                            await formik.setFieldValue('userRole', props.role);
                            setCurrentStep(1);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
              </Box>
            </div>
          </Slide>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Slide
            direction="right"
            in={Boolean(currentStep === 1)}
            timeout={{
              enter: 500,
              exit: currentStep === 1 ? 1 : 400,
            }}
            mountOnEnter
            unmountOnExit
          >
            <div>
              <DialogTitle>
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    onClick={() => {
                      formik.resetForm();
                      setCurrentStep(0);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <IconButton>
                      <ChevronLeft />
                    </IconButton>
                    <Typography>Back</Typography>
                  </Box>
                  <Typography variant="h6">Account information</Typography>
                  <IconButton onClick={handleCloseModal}>
                    <Close />
                  </IconButton>
                </Grid>
              </DialogTitle>
              <Box
                component="form"
                encType="multipart/form-data"
                noValidate
                onSubmit={formik.handleSubmit}
                pb={2}
              >
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} display="flex" justifyContent="center">
                      <AvatarFilePicker
                        name="imageUrl"
                        onChange={handleFileUpload}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography component="span" sx={{ marginRight: 1 }}>
                        Role:
                      </Typography>
                      <Typography component="span" fontWeight="700">
                        {formik.values.userRole.roleName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="companyId"
                        required
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
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PermIdentity />
                            </InputAdornment>
                          ),
                        }}
                        error={
                          formik.touched.companyId &&
                          Boolean(formik.errors.companyId)
                        }
                        helperText={
                          formik.touched.companyId && formik.errors.companyId
                        }
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
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
                          formik.touched.fullName &&
                          Boolean(formik.errors.fullName)
                        }
                        helperText={
                          formik.touched.fullName && formik.errors.fullName
                        }
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        name="gender"
                        required
                        select
                        margin="dense"
                        label="Gender"
                        fullWidth
                        value={formik.values.gender}
                        variant="outlined"
                        error={
                          formik.touched.gender && Boolean(formik.errors.gender)
                        }
                        helperText={
                          formik.touched.gender && formik.errors.gender
                        }
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
                        required
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
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DatePicker
                        label="Birthdate"
                        value={formik.values.birthdate}
                        inputFormat="dd/MM/yyyy"
                        onChange={selectedDate =>
                          handleChangeBirthdate(selectedDate)
                        }
                        renderInput={params => (
                          <TextField
                            {...params}
                            name="birthdate"
                            required
                            margin="dense"
                            fullWidth
                            error={
                              formik.touched.birthdate &&
                              Boolean(formik.errors.birthdate)
                            }
                            helperText={
                              formik.touched.birthdate &&
                              formik.errors.birthdate
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
                        required
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
                        error={
                          formik.touched.phoneNumber &&
                          Boolean(formik.errors.phoneNumber)
                        }
                        helperText={
                          formik.touched.phoneNumber &&
                          formik.errors.phoneNumber
                        }
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="address"
                        required
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
                        error={
                          formik.touched.address &&
                          Boolean(formik.errors.address)
                        }
                        helperText={
                          formik.touched.address && formik.errors.address
                        }
                        onChange={formik.handleChange}
                      />
                    </Grid>
                    {formik.values.userRole.roleID === 3 && (
                      <>
                        <Grid item xs={12}>
                          <TextField
                            name="classCode"
                            required
                            margin="dense"
                            label="Class"
                            fullWidth
                            variant="outlined"
                            value={formik.values.classCode}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={formik.handleChange}
                            error={
                              formik.touched.classCode &&
                              Boolean(formik.errors.classCode)
                            }
                            helperText={
                              formik.touched.classCode &&
                              formik.errors.classCode
                            }
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <ImagesDropzone
                            name="imageFiles"
                            onChange={handleImagesChange}
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
            </div>
          </Slide>
        </>
      )}
    </Dialog>
  );
};

export default AccountDetailDialog;
