import {
  ChevronLeft,
  Edit,
  EditOff,
  Delete,
  Description,
  PersonAdd,
} from '@mui/icons-material';
import {} from '@mui/icons-material';
import { Avatar, Button, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid';
import { grey } from '@mui/material/colors';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useHistory, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import { unwrapResult } from '@reduxjs/toolkit';
import CameraDto from 'dtos/camera.dto';
import { getCameras, updateCamera } from 'features/camera/camerasSlice';
import { FilterAlt } from '@mui/icons-material';
import EVDSDataGrid from 'components/EVDSDataGrid';
import Status from 'enums/status.enum';

interface ParamProps {
  id: string;
}

const Camera = () => {
  const dispatch = useAppDispatch();
  const cameras = useAppSelector(state => state.camera.current.cameras);
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const query = useQuery();
  const { id } = useParams<ParamProps>();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
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
        return (
          <Typography>
            {params.row.room != null ? params.row.room.roomName : 'Not yet'}
          </Typography>
        );
      },
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
        const status = params.row.status;
        return (
          <Typography
            variant="subtitle1"
            color={status == Status.isActive ? green[500] : red[500]}
          >
            {status == Status.isActive ? 'Active' : 'Disable'}
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
            // onClick={}
          />,
          <GridActionsCellItem
            label="Edit"
            icon={<Edit />}
            showInMenu
            // onClick={}
          />,
          <GridActionsCellItem
            label="View detail"
            icon={<Description />}
            showInMenu
            // onClick={}
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
      <EVDSDataGrid
        title="Manage Camera"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default Camera;
