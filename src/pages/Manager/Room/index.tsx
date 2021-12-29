/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridRowParams,
  GridSortModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import RoomDetailDialog from 'components/RoomDetailDialog';
import RoomStatus from 'configs/constants/roomStatus';
import Status from 'enums/status.enum';
import { disableRoom, searchByRoomName } from 'features/room/roomsSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const RoomPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [open, setOpen] = useState(false);
  const [page, setPage] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const history = useHistory();
  const { url } = useRouteMatch();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this room ?`,
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
    current: { rooms, totalItems },
  } = useAppSelector(state => state.room);
  const rows: GridRowModel[] = rooms.map(room => ({
    ...room.room,
    id: room.room.roomId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchRooms = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      searchByRoomName({
        search: searchValue,
        page,
        sort: sortParam.length > 0 ? sortParam : undefined,
        status: filterStatus as unknown as Status,
      }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchRooms().catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [rooms]);

  const handleDeleteRoom = async (roomId: string) => {
    try {
      const result = await dispatch(disableRoom(roomId));
      unwrapResult(result);
      enqueueSnackbar('Disable room success', {
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
    const roomId = String(getValue(id, 'roomId'));
    const name = String(getValue(id, 'roomName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove room ${name}`,
      handleAccept: () => handleDeleteRoom(roomId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'roomId', hide: true },
    { field: 'roomName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'floor',
      headerName: 'Floor',
      flex: 0.05,
      minWidth: 130,
    },
    {
      field: 'seatCount',
      headerName: 'Seats Count',
      flex: 0.05,
      minWidth: 130,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, 'status');
        let color = grey[400].toString();
        let statusText = 'Unknown';
        switch (active) {
          case Status.isReady:
            color = '#1890ff';
            statusText = 'Ready';
            break;

          case Status.isActive:
            color = green[500];
            statusText = 'Active';
            break;

          case Status.isDisable:
            color = red[500];
            statusText = 'Disable';
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
      getActions: params => {
        const roomId = String(params.getValue(params.id, 'roomId'));
        const status = params.getValue(params.id, 'status');
        const deleteItems = [
          <GridActionsCellItem
            label="View detail"
            showInMenu
            onClick={() => history.push(`${url}/${roomId}`)}
          />,
          <GridActionsCellItem
            label="Edit"
            showInMenu
            onClick={() => history.push(`${url}/${roomId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="Delete"
            sx={{ color: red[500] }}
            showInMenu
            onClick={() => showDeleteConfirmation(params)}
          />,
        ];
        if (status === Status.isDisable) {
          deleteItems.splice(1, 2);
        }
        return deleteItems;
      },
    },
  ];

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => setOpen(true)}
    >
      Create room
    </Button>
  );

  const FilterItems = () => (
    <Box>
      <Stack>
        <TextField
          name="status"
          select
          value={filterStatus}
          label="Status"
          margin="dense"
          size="small"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          SelectProps={{
            displayEmpty: true,
          }}
          onChange={event => setFilterStatus(event.target.value)}
        >
          <MenuItem key="all-status" value="">
            All
          </MenuItem>
          {RoomStatus.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction="row" sx={{ marginTop: 1 }} justifyContent="flex-end">
        <Button
          variant="text"
          sx={{ marginRight: 1 }}
          size="small"
          onClick={() => {
            setFilterStatus('');
          }}
        >
          Reset
        </Button>
        <Button variant="contained" size="small" onClick={() => fetchRooms()}>
          Apply
        </Button>
      </Stack>
    </Box>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchByRoomName({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <RoomDetailDialog
        title="Create room"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        hasFilter
        filterItems={<FilterItems />}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        isLoading={isLoading}
        title="Manage Rooms"
        page={page}
        columns={columns}
        rows={rows}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default RoomPage;
