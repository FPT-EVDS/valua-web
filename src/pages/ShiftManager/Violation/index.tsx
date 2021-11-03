import { Add } from '@mui/icons-material';
import { Button, Link, Typography } from '@mui/material';
import { GridActionsColDef, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { format } from 'date-fns';
import { searchViolation } from 'features/violation/violationsSlice';
import Evidence from 'models/evidence.model';
import ExamRoom from 'models/examRoom.model';
import User from 'models/user.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

const ViolationPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [open, setOpen] = useState(false);
  const { url } = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [page, setPage] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const {
    isLoading,
    current: { violations, totalItems },
  } = useAppSelector(state => state.violation);

  useEffect(() => {
    setOpen(false);
  }, [violations]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: '', hide: true },
    {
      field: 'examRoom',
      headerName: 'Shift name',
      flex: 0.115,
      minWidth: 130,
      renderCell: params => {
        const examRoom = params.getValue(params.id, params.field) as ExamRoom;
        return examRoom ? (
          <Typography>{examRoom.examRoomName}</Typography>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      flex: 0.12,
      minWidth: 130,
      renderCell: params => {
        const createdDate = format(
          new Date(params.row.createdDate),
          'dd/MM/yyyy',
        );
        return <Typography>{createdDate.toLocaleString()}</Typography>;
      },
    },
    {
      field: 'evidence',
      headerName: 'Added By',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const evidence = params.getValue(params.id, params.field) as Evidence;
        return evidence ? (
          <Typography>{evidence.staff?.fullName}</Typography>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'violator',
      headerName: 'Violator',
      flex: 0.13,
      minWidth: 130,
      renderCell: params => {
        const violator = params.getValue(params.id, params.field) as User;
        return <Typography>{violator.fullName}</Typography>;
      },
    },
    {
      field: 'violationId',
      headerName: 'Action',
      type: 'action',
      renderCell: params => {
        const violation = params.getValue(params.id, params.field) as string;
        return violation ? (
          <Link
            component={RouterLink}
            to={`/shift-manager/violation/${violation}`}
            underline="hover"
          >
            View detail
          </Link>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
  ];

  const rows: GridRowModel[] = violations.map(violation => ({
    ...violation,
    id: violation.violationId,
  }));

  const fetchViolation = async (search: string, pageNum: number) => {
    const actionResult = await dispatch(
      searchViolation({ search, page: pageNum }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchViolation(searchValue, page).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchViolation({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => setOpen(true)}
    >
      ok
    </Button>
  );

  return (
    <div>
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        isLoading={isLoading}
        rowCount={totalItems}
        title="Manage Violation"
        columns={columns}
        rows={rows}
        page={page}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
      />
    </div>
  );
};

export default ViolationPage;
