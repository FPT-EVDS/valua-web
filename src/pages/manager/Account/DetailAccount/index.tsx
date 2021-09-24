import { ChevronLeft, Edit, EditOff } from '@mui/icons-material';
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
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import OverviewCard from 'components/OverviewCard';
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
  const initialValues = account;
  // const formik = useFormik({
  //   initialValues,
  //   onSubmit: async (payload: AppUserDto) => {
  //     try {
  //       // FIXME: BAD PRACTICES
  //       const data = {
  //         ...payload,
  //         userRole: {
  //           roleID: payload.roleID,
  //         },
  //         imageUrl: payload.imageUrl?.length === 0 ? null : payload.imageUrl,
  //         studentId: payload.studentId?.length === 0 ? null : payload.studentId,
  //         classCode: payload.classCode?.length === 0 ? null : payload.classCode,
  //       };
  //       const result = await dispatch(updateAccount(data));
  //       unwrapResult(result);
  //       enqueueSnackbar('Add account success', {
  //         variant: 'success',
  //         preventDuplicate: true,
  //       });
  //     } catch (error) {
  //       enqueueSnackbar(error, {
  //         variant: 'error',
  //         preventDuplicate: true,
  //       });
  //     }
  //   },
  // });

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
        onClick={() => history.goBack()}
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
                  sx={{ fontWeight: 'bold', fontSize: 16 }}
                  variant="h5"
                  gutterBottom
                >
                  Basic profile
                </Typography>
              }
              action={
                <IconButton>
                  {isEditable ? (
                    <EditOff sx={{ fontSize: 20 }} />
                  ) : (
                    <Edit sx={{ fontSize: 20 }} />
                  )}
                </IconButton>
              }
            />
            {/* <CardContent></CardContent> */}
            <Divider />
            <CardActions>
              <Button variant="contained">Update account</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailAccountPage;
