import { Delete, Description, Edit, PersonAdd } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
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
import Status from 'enums/status.enum';
import { disableCamera, getCameras } from 'features/camera/camerasSlice';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const CameraPage = () => {
  const [open, setOpen] = useState(false);
  const { url } = useRouteMatch();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const cameras = useAppSelector(state => state.camera.current.cameras);
  const history = useHistory();
  const query = useQuery();
  const {
    isLoading,
    current: { accounts },
  } = useAppSelector(state => state.account);
  const { id } = useParams<ParamProps>();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
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

  const fetchCamera = async (numOfPage: number) => {
    const actionResult = await dispatch(getCameras(numOfPage));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchCamera(0).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteAccount = async (cameraId: string) => {
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
      handleAccept: () => handleDeleteAccount(cameraId),
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
      renderCell: params => (
        <Typography>
          {params.row.room != null ? params.row.room.roomName : 'Not yet'}
        </Typography>
      ),
    },
    {
      field: 'purchaseDate',
      headerName: 'Purchased Date',
      flex: 0.12,
      minWidth: 130,
      renderCell: params => {
        const purchaseDate = new Date(params.row.purchaseDate);
        return <Typography>{purchaseDate.toLocaleString()}</Typography>;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const { status } = params.row;
        return (
          <Typography
            variant="subtitle1"
            color={status === Status.isActive ? green[500] : red[500]}
          >
            {status === Status.isActive ? 'Active' : 'Disable'}
          </Typography>
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
        if (!status) deleteItems.shift();
        return deleteItems;
      },
    },
  ];

  const AddButton = () => <Button variant="contained">Add camera</Button>;

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <CameraDetailDialog
        title="Create camera"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <EVDSDataGrid
        isLoading={isLoading}
        title="Manage Camera"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default CameraPage;
