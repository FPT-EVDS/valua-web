/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Avatar, Box, Button, Link, Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { GridActionsColDef, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import Status from 'enums/feedbackStatus.enum';
import { searchFeedback } from 'features/feedback/feedbacksSlice';
import User from 'models/user.model';
import Violation from 'models/violation.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink
} from 'react-router-dom';

const FeedbackPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
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
      field: 'examinee',
      headerName: 'Examinee',
      flex: 0.13,
      minWidth: 130,
      renderCell: params => {
        const examinee = params.getValue(params.id, params.field) as User;
        return examinee ? (
          <Typography>{examinee?.fullName}</Typography>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'examRoomName',
      sortable: false,
      filterable: false,
      headerName: 'Exam room name',
      flex: 0.1,
      renderCell: ({ getValue, id: rowId }) => {
        const {examRoom} = getValue(rowId, "violation") as Violation;
        return (
          <>
            {examRoom ? (
              <Typography>{examRoom?.examRoomName}</Typography>
            ) : (
              <Typography>N/A</Typography>
            )}
          </>
        );
      },
    },
    {
      field: 'violation',
      headerName: 'Confirmed by',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const {examRoom} = params.getValue(params.id, params.field) as Violation;
        return examRoom ? (
          <>
          <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  alt={`${examRoom.staff.fullName}`}
                  src={String(examRoom.staff.imageUrl)}
                  sx={{ width: 32, height: 32 }}
                />
                <div>{examRoom.staff.fullName}</div>
              </Stack>
              </>
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
          case Status.isResolved:
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

  console.log(rows)

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
      />
    </div>
  );
};

export default FeedbackPage;
