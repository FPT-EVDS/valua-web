import { Avatar, Button, Grid } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import ProfileDetailCard from 'components/ProfileDetailCard';
import ProfileOverviewCard from 'components/ProfileOverviewCard';
import React from 'react';

const Profile = () => {
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
                    src={String(user?.imageUrl)}
                    alt={`${String(user?.fullName)} avatar`}
                  />
                }
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
