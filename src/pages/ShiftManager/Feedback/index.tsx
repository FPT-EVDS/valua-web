/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Box, Avatar, Button, Link, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { GridActionsColDef, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import Status from 'enums/status.enum';
import { searchFeedback } from 'features/feedback/feedbacksSlice';
import ExamRoom from 'models/examRoom.model';
import User from 'models/user.model';
import Violation from 'models/violation.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

const FeedbackPage = () => {
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
    current: { feedbacks, totalItems },
  } = useAppSelector(state => state.feedback);

  useEffect(() => {
    setOpen(false);
  }, [feedbacks]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    {
      field: 'shiftManger',
      sortable: false,
      filterable: false,
      renderCell: params => {
        const imageUrl = String(params.getValue(params.id, 'imageUrl'));
        const fullName = String(params.getValue(params.id, 'fullName'));
        return (
          <>
            {imageUrl ? (
              <Avatar alt={fullName} src={imageUrl} />
            ) : (
              <Typography>N/A</Typography>
            )}
          </>
        );
      },
      align: 'center',
      headerName: '',
      flex: 0.05,
      minWidth: 64,
    },
    {
      field: 'violation',
      headerName: 'Reporter name',
      flex: 0.13,
      minWidth: 130,
      renderCell: params => {
        const violation = params.getValue(params.id, params.field) as Violation;
        return violation ? (
          <Typography>{violation.examRoom?.staff?.fullName}</Typography>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'examRoom',
      headerName: 'Shift ID',
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
      field: 'shiftManager',
      headerName: 'Confirmed by',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const shiftManager = params.getValue(params.id, params.field) as User;
        return shiftManager ? (
          <Typography>{shiftManager.fullName}</Typography>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, 'status');
        let color = '#1890ff';
        let statusText = 'Pending';
        switch (active) {
          case Status.isActive:
            color = green[500];
            statusText = 'Accepted';
            break;

          case Status.isDisable:
            color = red[500];
            statusText = 'Rejected';
            break;

          default:
            break;
        }
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
      field: 'feedbackId',
      headerName: 'Action',
      type: 'action',
      renderCell: params => {
        const feedback = params.getValue(params.id, params.field) as string;
        return feedback ? (
          <Link
            component={RouterLink}
            to={`/shift-manager/feedback/${feedback}`}
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

  const rows: GridRowModel[] = feedbacks.map(feedback => ({
    ...feedback,
    id: feedback.feedbackId,
  }));

  const fetchFeedback = async (search: string, pageNum: number) => {
    const actionResult = await dispatch(
      searchFeedback({ search, page: pageNum }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchFeedback(searchValue, page).catch(error =>
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
      searchFeedback({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => setOpen(true)}
    >
      Add
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
        title="Manage Feedback"
        columns={columns}
        rows={rows}
        page={page}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default FeedbackPage;
