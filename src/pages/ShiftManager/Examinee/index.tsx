import { FiberManualRecord } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import ImportExcelButton from 'components/ImportExcelButton';
import SemesterDropdown from 'components/SemesterDropdown';
import {
  searchSubjectBySemester,
  updateExamineeSemester,
} from 'features/subjectExaminee/subjectExamineeSlice';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this subject examinee ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { subjects: examineeSubjects, totalItems },
    selectedSemester,
  } = useAppSelector(state => state.subjectExaminee);
  const rows: GridRowModel[] = examineeSubjects.map(examineeSubject => ({
    ...examineeSubject,
    id: examineeSubject.subject.subjectId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const fetchExamineeSubject = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    if (selectedSemester)
      dispatch(
        searchSubjectBySemester({
          page,
          sort: sortParam,
          semesterId: selectedSemester.semesterId,
        }),
      )
        .then(result => unwrapResult(result))
        .catch(error =>
          enqueueSnackbar(error, {
            variant: 'error',
            preventDuplicate: true,
          }),
        );
  };

  useEffect(() => {
    fetchExamineeSubject();
  }, [page, sortModel, selectedSemester]);

  // const handleDeleteSubject = async (shiftId: string) => {
  //   try {
  //     const result = await dispatch(deleteShift(shiftId));
  //     unwrapResult(result);
  //     enqueueSnackbar('Delete shift success', {
  //       variant: 'success',
  //       preventDuplicate: true,
  //     });
  //     setConfirmDialogProps(prevState => ({
  //       ...prevState,
  //       open: false,
  //     }));
  //   } catch (error) {
  //     enqueueSnackbar(error, {
  //       variant: 'error',
  //       preventDuplicate: true,
  //     });
  //     setConfirmDialogProps(prevState => ({
  //       ...prevState,
  //       open: false,
  //     }));
  //   }
  // };

  // const showDeleteConfirmation = ({ getValue, id }: GridRowParams) => {
  //   const shiftId = String(getValue(id, 'shiftId'));
  //   setConfirmDialogProps(prevState => ({
  //     ...prevState,
  //     open: true,
  //     title: `Do you want to disable this shift`,
  //     handleAccept: () => handleDeleteSubject(shiftId),
  //   }));
  // };

  const columns: Array<GridColDef | GridActionsColDef> = [
    {
      field: 'subject',
      hide: true,
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ row }) => (row.subject as Subject).subjectCode,
    },
    {
      field: 'subjectName',
      headerName: 'Subject name',
      flex: 0.3,
      minWidth: 130,
      renderCell: ({ row }) => (row.subject as Subject).subjectName,
    },
    {
      field: 'totalExaminees',
      headerName: 'Total examinees',
      flex: 0.3,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'totalUnassigned',
      headerName: 'Total unassigned',
      flex: 0.3,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'isReady',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ getValue, id, field }) => {
        const isReady = getValue(id, field);
        const color = isReady ? green[500] : red[500];
        const statusText = isReady ? 'Ready' : 'Not ready';
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
      getActions: params => {
        const subject = params.getValue(params.id, 'subject') as Subject;
        return [
          <GridActionsCellItem
            label="View detail"
            showInMenu
            onClick={() =>
              history.push(
                `${url}/subject?semesterId=${String(
                  selectedSemester?.semesterId,
                )}&subjectId=${subject.subjectId}`,
              )
            }
          />,
          <GridActionsCellItem
            label="Delete"
            showInMenu
            sx={{ color: red[500] }}
          />,
        ];
      },
    },
  ];

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const handleChangeSemester = (
    semester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    dispatch(updateExamineeSemester(semester));
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <EVDSDataGrid
        pagination
        leftActions={
          <SemesterDropdown
            payload={{ beginDate: new Date() }}
            textFieldProps={{
              size: 'small',
            }}
            isEditable
            value={selectedSemester}
            onChange={handleChangeSemester}
          />
        }
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        sortingMode="server"
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        rowCount={totalItems}
        isLoading={isLoading}
        hasSearch={false}
        title="Manage Examinee"
        columns={columns}
        page={page}
        onPageChange={newPage => setPage(newPage)}
        rows={rows}
        addButton={<ImportExcelButton />}
      />
    </div>
  );
};

export default ExamineePage;
