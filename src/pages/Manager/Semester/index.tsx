/* eslint-disable prefer-destructuring */
import {
  Add,
  Delete,
  Description,
  Edit,
  FiberManualRecord,
} from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import SemesterDetailDialog from 'components/SemesterDetailDialog';
import { add, format } from 'date-fns';
import { SearchByNameDto } from 'dtos/searchByName.dto';
import SemesterDto from 'dtos/semester.dto';
import {
  disableSemester,
  searchBySemesterName,
} from 'features/semester/semestersSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

const SemesterPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this semester ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { semesters, totalItems },
  } = useAppSelector(state => state.semesters);
  const rows: GridRowModel[] = semesters.map(semester => ({
    ...semester,
    id: semester.semesterId,
  }));
  const [initialValues, setInitialValues] = useState<SemesterDto>({
    semesterId: null,
    semesterName: '',
    beginDate: new Date(),
    endDate: add(new Date(), { months: 1 }),
  });

  const fetchSemesters = async (payload: SearchByNameDto) => {
    const actionResult = await dispatch(searchBySemesterName(payload));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchSemesters({ page, search: searchValue }).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [semesters]);

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

  const showDeleteConfirmation = ({ getValue, id }: GridRowParams) => {
    const semesterId = String(getValue(id, 'semesterId'));
    const name = String(getValue(id, 'semesterName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove semester ${name}`,
      handleAccept: () => handleDeleteSemester(semesterId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'semesterId', hide: true },
    { field: 'semesterName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'beginDate',
      headerName: 'Begin date',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ id, field, getValue }) =>
        format(new Date(String(getValue(id, field))), 'dd/MM/yyyy'),
    },
    {
      field: 'endDate',
      headerName: 'End date',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ id, field, getValue }) =>
        format(new Date(String(getValue(id, field))), 'dd/MM/yyyy'),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
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
      getActions: params => {
        const isActive = params.getValue(params.id, 'isActive');
        const deleteItems = [
          <GridActionsCellItem
            label="Delete"
            icon={<Delete />}
            showInMenu
            onClick={() => showDeleteConfirmation(params)}
          />,
          <GridActionsCellItem
            label="Edit"
            icon={<Edit />}
            showInMenu
            onClick={() => {
              setIsUpdate(true);
              setInitialValues(params.row as SemesterDto);
              setOpen(true);
            }}
          />,
          <GridActionsCellItem
            label="View subjects"
            icon={<Description />}
            showInMenu
          />,
        ];
        if (!isActive) deleteItems.shift();
        return deleteItems;
      },
    },
  ];

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => {
        setOpen(true);
        setIsUpdate(false);
      }}
    >
      Create semester
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchBySemesterName({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <SemesterDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        isUpdate={isUpdate}
        initialValues={initialValues}
      />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
        isLoading={isLoading}
        title="Manage Semesters"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
        hasFilter={false}
      />
    </div>
  );
};

export default SemesterPage;
