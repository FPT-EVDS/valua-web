import { Button, Grid } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ChangePasswordDialog from 'components/ChangePasswordDialog';
import LoadingIndicator from 'components/LoadingIndicator';
import ProfileDetailCard from 'components/ProfileDetailCard';
import ProfileOverviewCard from 'components/ProfileOverviewCard';
import { updateUserProfile } from 'features/auth/authSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useRef, useState } from 'react';

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector(state => state.auth);
  const [open, setOpen] = useState(false);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];
    if (newImage && newImage.type.startsWith('image/') && user) {
      try {
        const { fullName, gender, birthdate, address, phoneNumber } = user;
        const formData = new FormData();
        const accountDataBlob = new Blob(
          [
            JSON.stringify({
              fullName,
              gender,
              birthdate,
              address,
              phoneNumber,
            }),
          ],
          {
            type: 'application/json',
          },
        );
        formData.append('account', accountDataBlob);
        formData.append('profilePicture', newImage as unknown as Blob);
        const result = await dispatch(updateUserProfile(formData));
        unwrapResult(result);
        showSuccessMessage('Update profile successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    } else {
      showErrorMessage('Invalid file type');
    }
  };

  const GroupButtons = () => (
    <>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <Button
            component="label"
            htmlFor="upload-image-button"
            variant="text"
            color="primary"
          >
            <input
              title="image"
              ref={inputFileRef}
              name="image"
              accept="image/*"
              type="file"
              style={{ display: 'none' }}
              id="upload-image-button"
              onChange={handleOnChange}
            />
            Upload image
          </Button>
          <Button variant="text" color="primary" onClick={handleOpen}>
            Update password
          </Button>
        </>
      )}
    </>
  );

  return (
    <div>
      <Grid container mt={2} spacing={2}>
        {user && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <ChangePasswordDialog open={open} handleClose={handleClose} />
              <ProfileOverviewCard
                user={user}
                actionButtons={<GroupButtons />}
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <ProfileDetailCard user={user} isLoading={isLoading} />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default ProfilePage;
