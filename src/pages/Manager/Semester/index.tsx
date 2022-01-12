import { Add, FiberManualRecord } from '@mui/icons-material';
import { DatePicker } from '@mui/lab';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
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
import SemesterDetailDialog from 'components/SemesterDetailDialog';
import { add, format, isBefore, isValid } from 'date-fns';
import SemesterDto from 'dtos/semester.dto';
import Status from 'enums/status.enum';
import {
  activeSemester,
  disableSemester,
  searchBySemesterName,
} from 'features/semester/semestersSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const SemesterPage = () => {
  // FIXME: This is caused due to BE not support start and end date
  const DEFAULT_START_DATE = '1/1/1980';
  const DEFAULT_END_DATE = '12/31/2090';
  const DEFAULT_PAGE_SIZE = 20;
  const [page, setPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { url } = useRouteMatch();
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this semester ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { semesters, totalItems },
  } = useAppSelector(state => state.semesters);
  const rows: GridRowModel[] = semesters.map(semester => ({
    ...semester,
    id: semester.semesterId,
  }));
  const initialValues: SemesterDto = {
    semesterId: null,
    semesterName: '',
    beginDate: new Date(),
    endDate: add(new Date(), { months: 1 }),
  };
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBeginDate, setFilterBeginDate] = useState<Date | null>(
    new Date(DEFAULT_START_DATE),
  );
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(
    new Date(DEFAULT_END_DATE),
  );

  const fetchSemesters = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      searchBySemesterName({
        page,
        search: searchValue,
        sort: sortParam.length > 0 ? sortParam : undefined,
        beginDate: filterBeginDate || undefined,
        endDate: filterEndDate || undefined,
        status: filterStatus as unknown as Status,
      }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchSemesters().catch(error => showErrorMessage(error));
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [semesters]);

  const handleDeleteSemester = async (semesterId: string) => {
    try {
      const result = await dispatch(disableSemester(semesterId));
      unwrapResult(result);
      showSuccessMessage('Disable semester successfully');
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

  const handleActiveSemester = async (semesterId: string) => {
    try {
      const result = await dispatch(activeSemester(semesterId));
      unwrapResult(result);
      showSuccessMessage('Enable semester successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const showDeleteConfirmation = ({ getValue, id }: GridRowParams) => {
    const semesterId = String(getValue(id, 'semesterId'));
    const name = String(getValue(id, 'semesterName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to disable semester ${name}`,
      handleAccept: () => handleDeleteSemester(semesterId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'semesterId', hide: true },
    { field: 'semesterName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'beginDate',
      headerName: 'Begin date',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ value }) =>
        format(new Date(String(value)), 'dd/MM/yyyy'),
    },
    {
      field: 'endDate',
      headerName: 'End date',
      flex: 0.1,
      minWidth: 130,
      valueFormatter: ({ value }) =>
        format(new Date(String(value)), 'dd/MM/yyyy'),
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, params.field);
        const color = active ? green[500] : red[500];
        const statusText = active ? 'Active' : 'Inactive';
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
        const semesterId = String(params.getValue(params.id, 'semesterId'));
        const isActive = params.getValue(params.id, 'isActive');
        if (!isActive) {
          return [
            <GridActionsCellItem
              label="View detail"
              showInMenu
              onClick={() => history.push(`${url}/${String(semesterId)}`)}
            />,
            <GridActionsCellItem
              label="Enable"
              sx={{ color: green[500] }}
              showInMenu
              onClick={() => handleActiveSemester(semesterId)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            label="View detail"
            showInMenu
            onClick={() => history.push(`${url}/${String(semesterId)}`)}
          />,
          <GridActionsCellItem
            label="Edit"
            showInMenu
            onClick={() =>
              history.push(`${url}/${String(semesterId)}?edit=true`)
            }
          />,
          <GridActionsCellItem
            label="Delete"
            sx={{ color: red[500] }}
            showInMenu
            onClick={() => showDeleteConfirmation(params)}
          />,
        ];
      },
    },
  ];

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => {
        setOpen(true);
        setIsUpdate(false);
      }}
    >
      Create semester
    </Button>
  );

  const FilterItems = () => {
    const [beginDate, setBeginDate] = useState<Date | null>(filterBeginDate);
    const [endDate, setEndDate] = useState<Date | null>(filterEndDate);

    const handleChangeBeginDate = (selectedDate: Date | null) => {
      setBeginDate(selectedDate);
    };

    const handleChangeEndDate = (selectedDate: Date | null) => {
      setEndDate(selectedDate);
    };

    const handleSubmit = async () => {
      setFilterBeginDate(beginDate);
      setFilterEndDate(endDate);
      let sortParam = '';
      if (sortModel.length > 0) {
        const { field, sort } = sortModel[0];
        sortParam = `${field},${String(sort)}`;
      }
      const actionResult = await dispatch(
        searchBySemesterName({
          page,
          search: searchValue,
          sort: sortParam.length > 0 ? sortParam : undefined,
          beginDate: beginDate || undefined,
          endDate: endDate || undefined,
          status: filterStatus as unknown as Status,
        }),
      );
      unwrapResult(actionResult);
    };

    return (
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
            <MenuItem key="actived" value="1">
              Active
            </MenuItem>
            <MenuItem key="disabled" value="0">
              Inactive
            </MenuItem>
          </TextField>
          <DatePicker
            label="Begin date"
            value={beginDate}
            inputFormat="dd/MM/yyyy"
            onChange={handleChangeBeginDate}
            renderInput={params => (
              <TextField
                {...params}
                size="small"
                margin="dense"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <DatePicker
            label="End date"
            minDate={beginDate ? new Date(beginDate) : undefined}
            value={endDate}
            inputFormat="dd/MM/yyyy"
            onChange={handleChangeEndDate}
            renderInput={params => (
              <TextField
                {...params}
                name="endDate"
                size="small"
                margin="dense"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Stack>
        <Stack direction="row" sx={{ marginTop: 1 }} justifyContent="flex-end">
          <Button
            variant="text"
            sx={{ marginRight: 1 }}
            size="small"
            onClick={() => {
              setFilterStatus('');
              setBeginDate(new Date(DEFAULT_START_DATE));
              setFilterBeginDate(new Date(DEFAULT_START_DATE));
              setEndDate(new Date(DEFAULT_END_DATE));
              setFilterEndDate(new Date(DEFAULT_END_DATE));
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            size="small"
            disabled={
              (beginDate && !isValid(beginDate)) ||
              (endDate && !isValid(endDate)) ||
              isBefore(new Date(String(endDate)), new Date(String(beginDate)))
            }
            onClick={() => handleSubmit()}
          >
            Apply
          </Button>
        </Stack>
      </Box>
    );
  };

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchBySemesterName({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <SemesterDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        isUpdate={isUpdate}
        initialValues={initialValues}
      />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        hasFilter
        filterItems={<FilterItems />}
        page={page}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
        isLoading={isLoading}
        title="Manage Semesters"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default SemesterPage;
