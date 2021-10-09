/* eslint-disable prefer-destructuring */
import { Add, Delete, Description, Edit } from '@mui/icons-material';
import { Button, Link, Typography } from '@mui/material';
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
import { disableRoom, getRooms } from 'features/room/roomsSlice';
import Camera from 'models/camera.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

const RoomPage = () => {
  const [open, setOpen] = useState(false);
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
    current: { rooms },
  } = useAppSelector(state => state.room);
  const rows: GridRowModel[] = rooms.map(roomWithCamera => {
    const { room, camera } = roomWithCamera;
    return {
      ...room,
      camera,
      id: room.roomId,
    };
  });

  const fetchRooms = async (numOfPage: number) => {
    const actionResult = await dispatch(getRooms(numOfPage));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchRooms(0).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Typography>None</Typography>
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
        let statusText = 'Active';
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
          <Typography variant="subtitle1" color={color}>
            {statusText}
          </Typography>
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
      Add room
    </Button>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <RoomDetailDialog
        title="Create room"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <EVDSDataGrid
        isLoading={isLoading}
        title="Manage Rooms"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default RoomPage;
