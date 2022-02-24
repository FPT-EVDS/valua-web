/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord, Lock, PlayArrow } from '@mui/icons-material';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
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
import ButtonMenu, { ButtonMenuItemProps } from 'components/ButtonMenu';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import SemesterDropdown from 'components/SemesterDropdown';
import ShiftDetailDialog from 'components/ShiftDetailDialog';
import ShiftConfig from 'configs/constants/shiftConfig.status';
import { format } from 'date-fns';
import ShiftStatus from 'enums/shiftStatus.enum';
import { deleteShift, getShifts } from 'features/shift/shiftSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ShiftPage = () => {
  const isAllowEditStatuses = new Set([
    ShiftStatus.Locked,
    ShiftStatus.Removed,
    ShiftStatus.Finished,
    ShiftStatus.Staffing,
  ]);
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
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { shifts, totalItems, selectedSemester },
  } = useAppSelector(state => state.shift);
  const rows: GridRowModel[] = shifts.map(shift => ({
    ...shift,
    id: shift.shiftId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState(-1);
  const [dropdownSemesterValue, setDropdownSemesterValue] =
    useState<Semester | null>(null);

  const fetchShift = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    dispatch(
      getShifts({
        page,
        sort: sortParam,
        semesterId: dropdownSemesterValue
          ? dropdownSemesterValue.semesterId
          : undefined,
        status: filterStatus >= 0 ? filterStatus : undefined,
      }),
    )
      .then(result => unwrapResult(result))
      .catch(error => showErrorMessage(String(error)));
  };

  useEffect(() => {
    fetchShift();
  }, [page, sortModel, dropdownSemesterValue]);

  const handleDeleteShift = async (shiftId: string) => {
    try {
      const result = await dispatch(deleteShift(shiftId));
      unwrapResult(result);
      showSuccessMessage('This shift has been successfully deleted');
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
        const shiftStatus = params.getValue(params.id, 'status') as ShiftStatus;
        const shiftConfigIndex = ShiftConfig.findIndex(
          value => value.value === shiftStatus,
        );
        // Set default config as unknown
        let shiftConfig = ShiftConfig[ShiftConfig.length - 1];
        if (shiftConfigIndex > -1) shiftConfig = ShiftConfig[shiftConfigIndex];
        return (
          <Box display="flex" alignItems="center">
            <FiberManualRecord
              sx={{ fontSize: 14, marginRight: 1, color: shiftConfig.color }}
            />
            <Typography variant="subtitle1" color={shiftConfig.color}>
              {shiftConfig.label}
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
        const status = params.getValue(params.id, 'status') as ShiftStatus;
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
        if (isAllowEditStatuses.has(status)) deleteItems.splice(1, 2);
        return deleteItems;
      },
    },
  ];

  const AddButton = () => {
    const items: ButtonMenuItemProps[] = [
      {
        label: 'Add shift',
        icon: <Add />,
        handleItemClick: () => {
          setOpen(true);
        },
      },
      {
        label: 'Start staffing',
        icon: <PlayArrow />,
        handleItemClick: () => {},
      },
      {
        label: 'Lock all',
        icon: <Lock />,
        handleItemClick: () => {},
      },
    ];
    return (
      <Stack direction="row" spacing={2} alignItems="center">
        <ButtonMenu items={items} />
      </Stack>
    );
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const handleChangeSemester = (
    _selectedSemester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    const shiftSemester = _selectedSemester as Semester | null;
    if (shiftSemester) {
      setDropdownSemesterValue(shiftSemester);
    }
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
          onChange={event => {
            setFilterStatus(parseInt(event.target.value, 10));
          }}
        >
          <MenuItem key="all-status" value={-1}>
            All
          </MenuItem>
          {ShiftConfig.map(
            (config, index) =>
              index < ShiftConfig.length - 1 && (
                <MenuItem key={config.value} value={config.value}>
                  {config.label}
                </MenuItem>
              ),
          )}
        </TextField>
      </Stack>
      <Stack direction="row" sx={{ marginTop: 1 }} justifyContent="flex-end">
        <Button
          variant="text"
          sx={{ marginRight: 1 }}
          size="small"
          onClick={() => {
            setFilterStatus(-1);
          }}
        >
          Reset
        </Button>
        <Button variant="contained" size="small" onClick={() => fetchShift()}>
          Apply
        </Button>
      </Stack>
    </Box>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <ShiftDetailDialog open={open} handleClose={() => setOpen(false)} />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        leftActions={
          selectedSemester && (
            <SemesterDropdown
              textFieldProps={{
                size: 'small',
              }}
              isEditable
              value={dropdownSemesterValue}
              onChange={handleChangeSemester}
            />
          )
        }
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        hasFilter
        filterItems={<FilterItems />}
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
