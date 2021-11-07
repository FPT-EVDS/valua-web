/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { green, grey, orange, red } from '@mui/material/colors';
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
import SemesterDropdown from 'components/SemesterDropdown';
import ShiftDatepicker from 'components/ShiftDatepicker';
import ShiftDetailDialog from 'components/ShiftDetailDialog';
import { format } from 'date-fns';
import ShiftStatus from 'enums/shiftStatus.enum';
import Status from 'enums/status.enum';
import {
  deleteShift,
  getShiftCalendar,
  getShifts,
  updateCurrentSelectedDate,
  updateShiftSemester,
} from 'features/shift/shiftSlice';
import Semester from 'models/semester.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ShiftPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this shift ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { shifts, totalItems },
    semester,
    activeShiftDates,
  } = useAppSelector(state => state.shift);
  const rows: GridRowModel[] = shifts.map(shift => ({
    ...shift,
    id: shift.shiftId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const showErrorMessage = (error: string) =>
    enqueueSnackbar(error, {
      variant: 'error',
      preventDuplicate: true,
    });

  const fetchShift = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    dispatch(updateCurrentSelectedDate(selectedDate));
    dispatch(
      getShifts({
        page,
        sort: sortParam,
        semesterId: semester ? semester.semesterId : undefined,
        date: selectedDate ? new Date(selectedDate) : undefined,
      }),
    )
      // eslint-disable-next-line promise/always-return
      .then(result => {
        const { selectedDate: currentSelectedDate } = unwrapResult(result);
        setSelectedDate(currentSelectedDate);
      })
      .catch(error => showErrorMessage(String(error)));
  };

  useEffect(() => {
    fetchShift();
  }, [page, sortModel, semester, selectedDate]);

  useEffect(() => {
    if (semester)
      dispatch(getShiftCalendar(semester.semesterId))
        .then(result => unwrapResult(result))
        .catch(error => showErrorMessage(error));
  }, [semester]);

  const handleDeleteShift = async (shiftId: string) => {
    try {
      const result = await dispatch(deleteShift(shiftId));
      unwrapResult(result);
      enqueueSnackbar('This shift has been successfully deleted', {
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
      title: `Do you want to disable this shift`,
      handleAccept: () => handleDeleteShift(shiftId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'shiftId', hide: true },
    {
      field: 'beginTime',
      headerName: 'Begin time',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ value }) =>
        format(new Date(String(value)), 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'finishTime',
      headerName: 'Finish time',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ value }) =>
        format(new Date(String(value)), 'dd/MM/yyyy HH:mm'),
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
          case ShiftStatus.Inactive:
            color = grey[500];
            statusText = 'Inactive';
            break;

          case ShiftStatus.NotReady:
            color = red[500];
            statusText = 'Not ready';
            break;

          case ShiftStatus.Ready:
            color = '#1890ff';
            statusText = 'Ready';
            break;

          case ShiftStatus.Ongoing:
            color = orange[400];
            statusText = 'Ongoing';
            break;

          case ShiftStatus.Finished:
            color = green[500];
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
      getActions: params => {
        const shiftId = params.getValue(params.id, 'shiftId') as string;
        const status = params.getValue(params.id, 'status') as Status;
        const deleteItems = [
          <GridActionsCellItem
            label="View detail"
            showInMenu
            onClick={() => history.push(`${url}/${shiftId}`)}
          />,
          <GridActionsCellItem
            label="Edit"
            showInMenu
            onClick={() => history.push(`${url}/${shiftId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="Delete"
            showInMenu
            sx={{ color: red[500] }}
            onClick={() => showDeleteConfirmation(params)}
          />,
        ];
        if (status === Status.isDisable) deleteItems.pop();
        return deleteItems;
      },
    },
  ];

  const handleChangeDate = (date: Date | null) => {
    setSelectedDate(date);
  };

  const AddButton = () => (
    <Stack direction="row" spacing={2} alignItems="center">
      <ShiftDatepicker
        activeDate={activeShiftDates}
        handleChangeDate={handleChangeDate}
        value={selectedDate ? new Date(selectedDate) : new Date()}
      />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setOpen(true);
        }}
      >
        Add shift
      </Button>
    </Stack>
  );

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const handleChangeSemester = (
    selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    dispatch(updateShiftSemester(selectedSemester));
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <ShiftDetailDialog open={open} handleClose={() => setOpen(false)} />
      <EVDSDataGrid
        pagination
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        leftActions={
          semester && (
            <SemesterDropdown
              textFieldProps={{
                size: 'small',
              }}
              isEditable
              value={semester}
              onChange={handleChangeSemester}
            />
          )
        }
        pageSize={DEFAULT_PAGE_SIZE}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        rowCount={totalItems}
        isLoading={isLoading}
        hasSearch={false}
        title="Manage Shifts"
        columns={columns}
        page={page}
        onPageChange={newPage => setPage(newPage)}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default ShiftPage;
