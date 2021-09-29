import { Add, Delete, Description, Edit } from '@mui/icons-material';
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
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { format } from 'date-fns';
import { disableShift, getShifts } from 'features/shift/shiftSlice';
import Room from 'models/room.model';
import Subject from 'models/subject.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ShiftPage = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { url } = useRouteMatch();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this shift ?`,
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
    current: { shifts },
  } = useAppSelector(state => state.shift);
  const rows: GridRowModel[] = shifts.map(shift => ({
    ...shift,
    id: shift.shiftId,
  }));

  const fetchShift = async (numOfPage: number) => {
    const actionResult = await dispatch(getShifts(numOfPage));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchShift(0).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [shifts]);

  const handleDeleteShift = async (shiftId: string) => {
    try {
      const result = await dispatch(disableShift(shiftId));
      unwrapResult(result);
      enqueueSnackbar('Disable shift success', {
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
    const shiftId = String(getValue(id, 'shiftId'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove this shift`,
      handleAccept: () => handleDeleteShift(shiftId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'shiftId', hide: true },
    {
      field: 'subject',
      headerName: 'Subject',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ getValue, id, field }) => {
        const subject: Subject = getValue(id, field) as Subject;
        return <Typography>{subject.subjectCode}</Typography>;
      },
    },
    {
      field: 'examRoom',
      headerName: 'Room name',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ getValue, id, field }) => {
        const room: Room = getValue(id, field) as Room;
        return <Typography>{room.roomName}</Typography>;
      },
    },
    {
      field: 'beginTime',
      headerName: 'Begin time',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ id, field, getValue }) =>
        format(new Date(String(getValue(id, field))), 'dd/MM/yyyy'),
    },
    {
      field: 'finishTime',
      headerName: 'Finish time',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ id, field, getValue }) =>
        format(new Date(String(getValue(id, field))), 'dd/MM/yyyy'),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ id, field, getValue }) => {
        const active = getValue(id, field);
        return (
          <Typography
            variant="subtitle1"
            color={active ? green[500] : red[500]}
          >
            {active ? 'Active' : 'Disable'}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: params => {
        const shiftId = params.getValue(params.id, 'shiftId') as string;
        const status = params.getValue(params.id, 'isActive') as string;
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
            onClick={() => history.push(`${url}/${shiftId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="View detail"
            icon={<Description />}
            showInMenu
            onClick={() => history.push(`${url}/${shiftId}`)}
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
      Add shift
    </Button>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <EVDSDataGrid
        isLoading={isLoading}
        title="Manage Shifts"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default ShiftPage;
