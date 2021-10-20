/* eslint-disable prefer-destructuring */
import {
  Add,
  Delete,
  Description,
  Edit,
  FiberManualRecord,
} from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';
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
import RoomDetailDialog from 'components/RoomDetailDialog';
import { disableRoom, searchByRoomName } from 'features/room/roomsSlice';
import Camera from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

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
  const rows: GridRowModel[] = rooms.map(roomWithCamera => {
    const { room, camera } = roomWithCamera;
    return {
      ...room,
      camera,
      id: room.roomId,
    };
  });

  const fetchRooms = async (search: string, numOfPage: number) => {
    const actionResult = await dispatch(
      searchByRoomName({ search, page: numOfPage }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchRooms(searchValue, page).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
    { field: 'floor', headerName: 'Floor', flex: 0.1, minWidth: 130 },
    { field: 'seatCount', headerName: 'Seats Count', flex: 0.1, minWidth: 130 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 0.2,
      minWidth: 130,
    },
    {
      field: 'camera',
      headerName: 'Assigned Camera',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const camera = params.getValue(
          params.id,
          params.field,
        ) as Camera | null;
        return camera ? (
          <Link
            component={RouterLink}
            to={`/manager/camera/${camera.cameraId}`}
            underline="hover"
          >
            {camera.cameraName}
          </Link>
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
        let statusText = 'Ready';
        switch (active) {
          case 1:
            color = green[500];
            statusText = 'Active';
            break;

          case 0:
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
            label="Delete"
            icon={<Delete />}
            showInMenu
            onClick={() => showDeleteConfirmation(params)}
          />,
          <GridActionsCellItem
            label="Edit"
            icon={<Edit />}
            showInMenu
            onClick={() => history.push(`${url}/${roomId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="View detail"
            icon={<Description />}
            showInMenu
            onClick={() => history.push(`${url}/${roomId}`)}
          />,
        ];
        if (!status) deleteItems.shift();
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

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchByRoomName({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <RoomDetailDialog
        title="Create room"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        isLoading={isLoading}
        title="Manage Rooms"
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
