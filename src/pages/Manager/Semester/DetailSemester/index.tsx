import { ChevronLeft, School } from '@mui/icons-material';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import OverviewCard from 'components/OverviewCard';
import SemesterDetailCard from 'components/SemesterDetailCard';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import {
  disableSemester,
  getSemester,
} from 'features/semester/detailSemesterSlice';
import Semester from 'models/semester.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface SemesterProps {
  semester: Semester;
}

const DetailSemesterPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { semester, isLoading } = useAppSelector(state => state.detailSemester);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this semester ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const history = useHistory();
  const { id } = useParams<ParamProps>();

  const fetchSemester = async (semesterId: string) => {
    const actionResult = await dispatch(getSemester(semesterId));
    unwrapResult(actionResult);
  };

  const OverviewContent = ({
    semester: { lastModifiedDate },
  }: SemesterProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  const handleDeleteSemester = async (semesterId: string) => {
    try {
      const result = await dispatch(disableSemester(semesterId));
      unwrapResult(result);
      enqueueSnackbar('Disable semester success', {
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

  const showDeleteConfirmation = (semesterId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteSemester(semesterId),
    }));
  };

  const GroupButtons = () => (
    <>
      <Button
        variant="text"
        color="error"
        onClick={() => showDeleteConfirmation(id)}
      >
        Disable semester
      </Button>
    </>
  );

  useEffect(() => {
    fetchSemester(id).catch(error =>
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
        onClick={() => history.push('/manager/semester')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to semester page</div>
      </Box>
      <Grid container mt={2} spacing={2}>
        {semester && (
          <>
            <Grid item xs={12} md={9} lg={4}>
              <Stack spacing={3}>
                <OverviewCard
                  title={semester.semesterName}
                  icon={<School fontSize="large" />}
                  status={
                    semester.isActive ? Status.isActive : Status.isDisable
                  }
                  content={<OverviewContent semester={semester} />}
                  actionButtons={<GroupButtons />}
                  isSingleAction
                />
                <SemesterDetailCard isLoading={isLoading} semester={semester} />
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailSemesterPage;
