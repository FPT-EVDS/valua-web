import { ChevronLeft } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DetailAccountCard from 'components/AccountDetailCard';
import AccountOverviewCard from 'components/AccountOverviewCard';
import { getAccount } from 'features/account/detailAccountSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailAccountPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { account, isLoading } = useAppSelector(state => state.detailAccount);
  const history = useHistory();
  const { id } = useParams<ParamProps>();

  const fetchAccount = async (appUserId: string) => {
    const actionResult = await dispatch(getAccount(appUserId));
    unwrapResult(actionResult);
  };

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

  useEffect(() => {
    fetchAccount(id).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {account && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <AccountOverviewCard
                account={account}
                actionButtons={<GroupButtons />}
              />
            </Grid>
            <Grid item xs={12} lg={8}>
              <DetailAccountCard account={account} isLoading={isLoading} />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailAccountPage;
