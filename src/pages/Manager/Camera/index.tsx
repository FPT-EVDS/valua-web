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
import CameraDetailDialog from 'components/CameraDetailDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import { disableCamera, searchCamera } from 'features/camera/camerasSlice';
import Room from 'models/room.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

const CameraPage = () => {
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
    current: { cameras, totalItems },
  } = useAppSelector(state => state.camera);

  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this camera ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const rows: GridRowModel[] = cameras.map(camera => ({
    ...camera,
    id: camera.cameraId,
  }));

  const fetchCamera = async (search: string, pageNum: number) => {
    const actionResult = await dispatch(
      searchCamera({ search, page: pageNum }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchCamera(searchValue, page).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setOpen(false);
  }, [cameras]);

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      const result = await dispatch(disableCamera(cameraId));
      unwrapResult(result);
      enqueueSnackbar('Disable camera success', {
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
    const cameraId = String(getValue(id, 'cameraId'));
    const name = String(getValue(id, 'cameraName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove camera ${name}`,
      handleAccept: () => handleDeleteCamera(cameraId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'cameraId', hide: true },
    {
      field: 'cameraName',
      headerName: 'Camera Name',
      flex: 0.12,
      minWidth: 130,
    },
    {
      field: 'room',
      headerName: 'Assigned Room',
      flex: 0.115,
      minWidth: 130,
      renderCell: params => {
        const room = params.getValue(params.id, params.field) as Room;
        return room ? (
          <Link
            component={RouterLink}
            to={`/manager/room/${room.roomId}`}
            underline="hover"
          >
            {room.roomName}
          </Link>
        ) : (
          <Typography>N/A</Typography>
        );
      },
    },
    {
      field: 'purchaseDate',
      headerName: 'Purchased Date',
      flex: 0.12,
      minWidth: 130,
      renderCell: params => {
        const purchaseDate = format(
          new Date(params.row.purchaseDate),
          'dd/MM/yyyy',
        );
        return <Typography>{purchaseDate.toLocaleString()}</Typography>;
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
        const cameraId = String(params.getValue(params.id, 'cameraId'));
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
            onClick={() => history.push(`${url}/${cameraId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="View detail"
            icon={<Description />}
            showInMenu
            onClick={() => history.push(`${url}/${cameraId}`)}
          />,
        ];
        if (!status) {
          deleteItems.shift();
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
      Create camera
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchCamera({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <CameraDetailDialog
        title="Create camera"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        isLoading={isLoading}
        rowCount={totalItems}
        title="Manage Camera"
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

export default CameraPage;
