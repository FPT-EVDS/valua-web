import { ChevronLeft } from '@mui/icons-material';
import { Box, Button, Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DetailAccountCard from 'components/AccountDetailCard';
import AccountOverviewCard from 'components/AccountOverviewCard';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import {
  disableAccount,
  getAccount,
} from 'features/account/detailAccountSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
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
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable ${String(account?.fullName)} ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });

  const fetchAccount = async (appUserId: string) => {
    const actionResult = await dispatch(getAccount(appUserId));
    unwrapResult(actionResult);
  };

  const handleDeleteRoom = async (accountId: string) => {
    try {
      const result = await dispatch(disableAccount(accountId));
      unwrapResult(result);
      enqueueSnackbar('Disable account success', {
        variant: 'success',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const showDeleteConfirmation = (accountId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteRoom(accountId),
    }));
  };

  const GroupButtons = () => (
    <>
      <Button variant="text">Upload picture</Button>
      <Button variant="text" sx={{ color: grey[700] }}>
        Reset password
      </Button>
      <Button
        variant="text"
        color="error"
        onClick={() => showDeleteConfirmation(id)}
      >
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
      <ConfirmDialog {...confirmDialogProps} />
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
