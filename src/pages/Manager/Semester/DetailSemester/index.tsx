import { Add, Delete, FiberManualRecord, School } from '@mui/icons-material';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddSubjectToSemesterDialog from 'components/AddSubjectToSemesterDialog';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import NotFoundItem from 'components/NotFoundItem';
import OverviewCard from 'components/OverviewCard';
import SemesterDetailCard from 'components/SemesterDetailCard';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import {
  disableSemester,
  enableSemester,
  getSemester,
  removeSubjectFromSemester,
  searchSemesterSubjects,
} from 'features/semester/detailSemesterSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface SemesterProps {
  semester: Semester;
}

const DetailSemesterPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const { semester, subjectSemesters, isLoading } = useAppSelector(
    state => state.detailSemester,
  );
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this semester ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { id } = useParams<ParamProps>();

  const fetchSemester = async (semesterId: string) => {
    const actionResult = await dispatch(getSemester(semesterId));
    unwrapResult(actionResult);
  };

  const rows: GridRowModel[] = subjectSemesters.map(subjectSemester => ({
    ...subjectSemester.subject,
    id: subjectSemester.subjectSemesterId,
  }));

  const handleDeleteSubject = async (
    subjectSemesterId: string,
    subjectId: string,
  ) => {
    try {
      if (semester) {
        const result = await dispatch(
          removeSubjectFromSemester({
            subjectSemesterId,
            subjectId,
          }),
        );
        unwrapResult(result);
        showSuccessMessage('Remove subject successfully');
        setConfirmDialogProps(prevState => ({
          ...prevState,
          open: false,
        }));
      }
    } catch (error) {
      showErrorMessage(error);
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const handleDeleteSemester = async (semesterId: string) => {
    try {
      const result = await dispatch(disableSemester(semesterId));
      unwrapResult(result);
      showSuccessMessage('Disable semester successfully');
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    } catch (error) {
      showErrorMessage(error);
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const handleEnableSemester = async (semesterId: string) => {
    try {
      const result = await dispatch(enableSemester(semesterId));
      unwrapResult(result);
      showSuccessMessage('Enable semester successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const showDeleteConfirmation = (semesterId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: 'Do you want to disable this semester ?',
      handleAccept: () => handleDeleteSemester(semesterId),
    }));
  };

  const showDeleteSubjectConfirmation = (
    subjectSemester: string,
    subjectCode: string,
    subjectId: string,
  ) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove ${subjectCode} ?`,
      handleAccept: () => handleDeleteSubject(subjectSemester, subjectId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'subjectId', hide: true },
    {
      field: 'subjectCode',
      headerName: 'Subject Code',
      flex: 0.1,
      minWidth: 130,
    },
    { field: 'subjectName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'active',
      headerName: 'Status',
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, params.field);
        const color = active ? green[500] : red[500];
        const statusText = active ? 'Active' : 'Disable';
        return (
          <Box display="flex" alignItems="center">
            <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
            <Typography variant="subtitle1" color={color}>
              {statusText}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      hide: semester?.isActive !== true,
      getActions: ({ getValue, id: rowId }) => {
        const subjectCode = String(getValue(rowId, 'subjectCode'));
        const subjectId = String(getValue(rowId, 'subjectId'));
        return [
          <GridActionsCellItem
            label="Delete"
            icon={<Delete />}
            onClick={() => {
              showDeleteSubjectConfirmation(
                String(rowId),
                subjectCode,
                subjectId,
              );
            }}
          />,
        ];
      },
    },
  ];

  const OverviewContent = ({
    semester: { lastModifiedDate },
  }: SemesterProps) => (
    <Typography gutterBottom color="text.secondary">
      Last Updated:{' '}
      {lastModifiedDate &&
        format(Date.parse(String(lastModifiedDate)), 'dd/MM/yyyy HH:mm')}
    </Typography>
  );

  const GroupButtons = () => (
    <>
      {semester?.isActive ? (
        <Button
          variant="text"
          color="error"
          onClick={() => showDeleteConfirmation(id)}
        >
          Disable semester
        </Button>
      ) : (
        <Button
          variant="text"
          color="success"
          onClick={() => handleEnableSemester(String(semester?.semesterId))}
        >
          Enable semester
        </Button>
      )}
    </>
  );

  useEffect(() => {
    fetchSemester(id).catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AddButton = () => (
    <>
      {semester?.isActive && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpen(true);
          }}
        >
          Add subject
        </Button>
      )}
    </>
  );

  const handleSearch = async (inputValue: string) => {
    dispatch(searchSemesterSubjects(inputValue));
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <BackToPreviousPageButton
        title="Back to semester page"
        route="/manager/semesters"
      />
      {semester ? (
        <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
          <AddSubjectToSemesterDialog
            open={open}
            handleClose={() => setOpen(false)}
          />
          <Grid item xs={12} md={9} lg={4}>
            <Stack spacing={3}>
              <OverviewCard
                title={semester.semesterName}
                icon={<School fontSize="large" />}
                status={semester.isActive ? Status.isActive : Status.isDisable}
                content={<OverviewContent semester={semester} />}
                actionButtons={<GroupButtons />}
                isSingleAction
              />
              <SemesterDetailCard isLoading={isLoading} semester={semester} />
            </Stack>
          </Grid>
          <Grid item xs={12} lg={8}>
            <EVDSDataGrid
              autoPageSize
              rowsPerPageOptions={[10]}
              title={`${semester.semesterName}'s subjects`}
              isLoading={isLoading}
              rows={rows}
              handleSearch={handleSearch}
              columns={columns}
              addButton={<AddButton />}
            />
          </Grid>
        </Grid>
      ) : (
        <NotFoundItem isLoading={isLoading} message="Semester not found" />
      )}
    </div>
  );
};

export default DetailSemesterPage;
