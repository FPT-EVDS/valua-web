import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  Stack,
} from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import DetailAccountCard from 'components/AccountDetailCard';
import AccountEmbeddingCard from 'components/AccountEmbeddingCard';
import AccountOverviewCard from 'components/AccountOverviewCard';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import NotFoundItem from 'components/NotFoundItem';
import Role from 'enums/role.enum';
import {
  activeAccount,
  disableAccount,
  getAccount,
  resetPassword,
} from 'features/account/detailAccountSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailAccountPage = () => {
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const { account, isLoading } = useAppSelector(state => state.detailAccount);
  const { id } = useParams<ParamProps>();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable ${String(account?.fullName)} ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const [open, setOpen] = useState(false);

  const fetchAccount = async (appUserId: string) => {
    const actionResult = await dispatch(getAccount(appUserId));
    unwrapResult(actionResult);
  };

  const handleDisableAccount = async (accountId: string) => {
    try {
      const result = await dispatch(disableAccount(accountId));
      unwrapResult(result);
      showSuccessMessage('Disable account successfully');
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const handleActiveAccount = async (accountId: string) => {
    try {
      const result = await dispatch(activeAccount(accountId));
      unwrapResult(result);
      showSuccessMessage('Active account successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const handleResetPassword = async (appUserId: string) => {
    try {
      const result = await dispatch(resetPassword(appUserId));
      unwrapResult(result);
      showSuccessMessage('Reset password successfully');
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const showDeleteConfirmation = (accountId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      title: `Do you want to disable ${String(account?.fullName)} ?`,
      open: true,
      handleAccept: () => handleDisableAccount(accountId),
    }));
  };

  const showResetPasswordConfirmation = (accountId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      title: `Are you sure ?`,
      open: true,
      handleAccept: () => handleResetPassword(accountId),
    }));
  };

  const GroupButtons = () => (
    <>
      {!isLoading ? (
        <>
          {account?.isActive ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%' }}
            >
              {account.role.roleName === Role.Examinee && (
                <Button
                  variant="text"
                  sx={{ color: blue[500] }}
                  onClick={() => setOpen(true)}
                >
                  Embed face
                </Button>
              )}
              <Button
                variant="text"
                sx={{ color: grey[700] }}
                onClick={() => showResetPasswordConfirmation(id)}
              >
                Reset password
              </Button>
              {account.role.roleName !== Role.ShiftManager && (
                <Button
                  variant="text"
                  color="error"
                  onClick={() => showDeleteConfirmation(id)}
                >
                  Disable account
                </Button>
              )}
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <Button
                variant="text"
                color="success"
                onClick={() => handleActiveAccount(id)}
              >
                Enable account
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );

  useEffect(() => {
    fetchAccount(id).catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <BackToPreviousPageButton
        title="Back to account page"
        route="/manager/accounts"
      />
      {account ? (
        <Grid container mt={2} spacing={2}>
          {account.isActive && account.role.roleName === Role.Examinee && (
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
              <AccountEmbeddingCard
                onSubmitSuccess={() => {
                  setOpen(false);
                }}
              />
            </Dialog>
          )}
          <Grid item xs={12} md={9} lg={4}>
            <Stack spacing={2}>
              <AccountOverviewCard
                account={account}
                actionButtons={<GroupButtons />}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={8}>
            <DetailAccountCard account={account} isLoading={isLoading} />
          </Grid>
        </Grid>
      ) : (
        <NotFoundItem isLoading={isLoading} message="Account not found" />
      )}
    </div>
  );
};

export default DetailAccountPage;
