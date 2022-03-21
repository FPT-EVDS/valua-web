import { Avatar, Button, Grid } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import ChangePasswordDialog from 'components/ChangePasswordDialog';
import ProfileDetailCard from 'components/ProfileDetailCard';
import ProfileOverviewCard from 'components/ProfileOverviewCard';
import React, { useState } from 'react';

const ProfilePage = () => {
  const { user, isLoading } = useAppSelector(state => state.auth);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const GroupButtons = () => (
    <>
      <Button variant="text" color="primary">
        Upload image
      </Button>
      <Button variant="text" color="primary" onClick={handleOpen}>
        Update password
      </Button>
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
