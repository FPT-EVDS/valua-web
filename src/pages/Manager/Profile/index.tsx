import { ChevronLeft } from '@mui/icons-material';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ProfileDetailCard from 'components/ProfileDetailCard';
import ProfileOverviewCard from 'components/ProfileOverviewCard';
import { format } from 'date-fns';
import User from 'models/user.model';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useHistory } from 'react-router-dom';

interface UserProps {
  user: User;
}

const Profile = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const { user, isLoading } = useAppSelector(state => state.auth);

  const GroupButtons = () => (
    <>
      <Button variant="text" color="info">
        Upload image
      </Button>
      <Button variant="text" color="info">
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
              <ProfileOverviewCard
                title={user.fullName}
                icon={
                  <Avatar
                    variant="square"
                    sx={{
                      borderRadius: '4px',
                      alignSelf: 'stretch',
                      height: '150px',
                      width: '150px',
                    }}
                    src={String(user?.profileImageUrl)}
                    alt={`${String(user?.fullName)} avatar`}
                  />
                }
                id={user.appUserId}
                role={user.role}
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

export default Profile;
