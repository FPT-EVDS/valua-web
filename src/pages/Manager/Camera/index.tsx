/* eslint-disable prefer-destructuring */
import {
  Add,
  Delete,
  Description,
  Edit,
  FiberManualRecord
} from '@mui/icons-material';
import {
  Box,
  Button,
  Link, MenuItem,
  Stack,
  TextField, Typography
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridRowParams,
  GridSortModel
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CameraDetailDialog from 'components/CameraDetailDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import CameraStatus from 'configs/constants/cameraStatus';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import { disableCamera, searchCamera } from 'features/camera/camerasSlice';
import Room from 'models/room.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  Link as RouterLink,
  useHistory,
  useRouteMatch
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
  const [filterStatus, setFilterStatus] = useState('');
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
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const fetchCamera = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      searchCamera({
        search: searchValue,
        page,
        sort: sortParam.length > 0 ? sortParam : undefined,
        status: filterStatus as unknown as Status,
      }),
    )
      .then(result => unwrapResult(result))
      .catch(error => {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      });
  };

  useEffect(() => {
    fetchCamera();
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [cameras]);

  const handleDeleteCamera = async (cameraId: string) => {
    try {
      const result = await dispatch(disableCamera(cameraId));
      unwrapResult(result);
      enqueueSnackbar('Delete camera success', {
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
      title: `Do you want to delete camera ${name}`,
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
        let statusText = 'Connected';
        switch (active) {
          case Status.isActive:
            color = green[500];
            statusText = 'Active';
            break;

          case Status.isDisable:
            color = red[500];
            statusText = 'Inactive';
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

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };


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
          {CameraStatus.map(option => (
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
        <Button variant="contained" size="small" onClick={() => fetchCamera()}>
          Apply
        </Button>
      </Stack>
    </Box>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
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
        filterItems={<FilterItems />}
        sortModel={sortModel}
        hasFilter
      />
    </div>
  );
};

export default CameraPage;
