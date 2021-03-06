/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Avatar, Box, Button, Grid, Stack, Typography } from '@mui/material';
import { blue, green, grey, indigo, orange, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AssignStaffDialog from 'components/AssignStaffDialog';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import NotFoundItem from 'components/NotFoundItem';
import ShiftDetailCard from 'components/ShiftDetailCard';
import {
  notAllowedEditExamRoomStatuses,
  notAllowEditShiftStatuses,
} from 'configs/constants/shiftConfig.status';
import ExamRoomStatus from 'enums/examRoomStatus.enum';
import ShiftStatus from 'enums/shiftStatus.enum';
import { deleteExamRoom, getExamRooms } from 'features/examRoom/examRoomSlice';
import { deleteShift, getShift } from 'features/shift/detailShiftSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Account from 'models/account.model';
import Room from 'models/room.model';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const DetailShiftPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const history = useHistory();
  const { id } = useParams<ParamProps>();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const { shift, isLoading } = useAppSelector(state => state.detailShift);
  const {
    current: { totalItems, examRooms },
    isLoading: isExamRoomLoading,
  } = useAppSelector(state => state.examRoom);
  const rows: GridRowModel[] = examRooms.map(examRoom => ({
    ...examRoom,
    capacity: `${examRoom.numOfTotalExaminees} / ${examRoom.room.seatCount}`,
    subject: examRoom.subjectSemester.subject,
    id: examRoom.examRoomId,
  }));
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this shift ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });

  const fetchShift = async (shiftId: string) => {
    const actionResult = await dispatch(getShift(shiftId));
    unwrapResult(actionResult);
  };

  const fetchShiftExamRoom = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    dispatch(
      getExamRooms({
        page,
        sort: sortParam,
        shiftId: id,
        search: searchValue,
      }),
    )
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(error));
  };

  useEffect(() => {
    fetchShiftExamRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortModel, searchValue]);

  useEffect(() => {
    if (id)
      fetchShift(id).catch(error => {
        showErrorMessage(error);
      });
  }, [id]);

  const handleDeleteShift = async (shiftId: string) => {
    try {
      const result = await dispatch(deleteShift(shiftId));
      unwrapResult(result);
      showSuccessMessage('This shift has been successfully deleted');
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
      history.push('/shift-manager/shifts');
    } catch (error) {
      showErrorMessage(error);
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const handleDeleteExamRoom = async (roomId: string) => {
    try {
      const result = await dispatch(deleteExamRoom(roomId));
      unwrapResult(result);
      showSuccessMessage('Exam room has been successfully deleted');
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

  const showDeleteConfirmation = (shiftId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      title: 'Do you want to delete this shift ?',
      open: true,
      handleAccept: () => handleDeleteShift(shiftId),
    }));
  };

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => history.push(`/shift-manager/shifts/${id}/exam-rooms/add`)}
    >
      Add new
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const showDeleteExamRoomConfirmation = (roomId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      title: 'Do you want to delete this exam room ?',
      open: true,
      handleAccept: () => handleDeleteExamRoom(roomId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'examRoomID', hide: true },
    {
      field: 'examRoomName',
      sortable: false,
      filterable: false,
      headerName: 'Exam room name',
      minWidth: 180,
      flex: 0.06,
    },
    {
      field: 'subject',
      sortable: false,
      filterable: false,
      headerName: 'Subject',
      minWidth: 80,
      valueFormatter: ({ value }) => (value as unknown as Subject).subjectCode,
    },
    {
      field: 'capacity',
      sortable: false,
      filterable: false,
      headerName: 'Capacity',
      minWidth: 100,
    },
    {
      field: 'room',
      sortable: false,
      filterable: false,
      headerName: 'Room',
      flex: 0.05,
      valueFormatter: ({ value }) => (value as unknown as Room).roomName,
    },
    {
      field: 'staff',
      sortable: false,
      filterable: false,
      headerName: 'Staff',
      flex: 0.07,
      minWidth: 120,
      renderCell: ({ getValue, id: rowId, field }) => {
        const staff = getValue(rowId, field) as Account | null;
        return (
          <>
            {staff ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  alt={`${staff.fullName}`}
                  src={String(staff.imageUrl)}
                  sx={{ width: 32, height: 32 }}
                />
                <div>{staff.fullName}</div>
              </Stack>
            ) : (
              <Typography>N/A</Typography>
            )}
          </>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      renderCell: ({ getValue, id: rowId, field }) => {
        const status = getValue(rowId, field);
        let color = grey[500].toString();
        let statusText = 'Unknown';
        switch (status) {
          case ExamRoomStatus.Disabled:
            color = red[500];
            statusText = 'Disabled';
            break;

          case ExamRoomStatus.NotReady:
            color = orange[400];
            statusText = 'Not ready';
            break;

          case ExamRoomStatus.Ready:
            color = green[500];
            statusText = 'Ready';
            break;

          case ExamRoomStatus.Started:
            color = blue[500];
            statusText = 'Started';
            break;

          case ExamRoomStatus.Finished:
            color = indigo[500];
            statusText = 'Finished';
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
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: ({ getValue, id: rowId }) => {
        const staff = getValue(rowId, 'staff') as Account;
        const status = getValue(rowId, 'status');
        const deleteItems = [
          <GridActionsCellItem
            label="Assign"
            showInMenu
            sx={{ justifyContent: 'right' }}
            onClick={() => {
              setCurrentRoomId(String(rowId));
              setOpen(true);
            }}
          />,
          <GridActionsCellItem
            label="View detail"
            showInMenu
            sx={{ justifyContent: 'right' }}
            onClick={() =>
              history.push(`/shift-manager/shifts/${id}/exam-rooms/${rowId}`)
            }
          />,
          <GridActionsCellItem
            label="Edit"
            showInMenu
            sx={{ justifyContent: 'right' }}
            onClick={() =>
              history.push(
                `/shift-manager/shifts/${id}/exam-rooms/${rowId}?edit=true`,
              )
            }
          />,
          <GridActionsCellItem
            label="Delete"
            sx={{ color: red[500], justifyContent: 'right' }}
            showInMenu
            onClick={() => showDeleteExamRoomConfirmation(String(rowId))}
          />,
        ];
        if (staff) deleteItems.shift();
        if (status === ExamRoomStatus.Disabled) deleteItems.pop();
        if (shift?.status === ShiftStatus.Staffing) {
          deleteItems.splice(2, 1);
        } else if (
          shift?.status &&
          notAllowedEditExamRoomStatuses.has(shift.status)
        ) {
          deleteItems.splice(1, 2);
        }
        return deleteItems;
      },
    },
  ];

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      {currentRoomId && (
        <AssignStaffDialog
          shiftId={id}
          open={open}
          handleClose={() => setOpen(false)}
          examRoomId={currentRoomId}
        />
      )}
      <BackToPreviousPageButton
        title="Back to shift page"
        route="/shift-manager/shifts"
      />
      {shift ? (
        <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
          <Grid item xs={12} lg={3}>
            <ShiftDetailCard
              shift={shift}
              isLoading={isLoading}
              handleDelete={showDeleteConfirmation}
            />
          </Grid>
          <Grid item xs={12} lg={9}>
            <EVDSDataGrid
              pagination
              paginationMode="server"
              rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
              pageSize={DEFAULT_PAGE_SIZE}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              rowCount={totalItems}
              isLoading={isExamRoomLoading}
              title="Exam room list"
              handleSearch={handleSearch}
              columns={columns}
              rows={rows}
              page={page}
              onPageChange={newPage => setPage(newPage)}
              addButton={
                !notAllowEditShiftStatuses.has(shift.status) && <AddButton />
              }
            />
          </Grid>
        </Grid>
      ) : (
        <NotFoundItem isLoading={isLoading} message="Shift not found" />
      )}
    </div>
  );
};

export default DetailShiftPage;
