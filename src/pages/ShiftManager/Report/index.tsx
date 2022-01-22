/* eslint-disable prefer-destructuring */
import { FiberManualRecord } from '@mui/icons-material';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { green, orange } from '@mui/material/colors';
import {
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridSortModel,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AvatarWithTitle from 'components/AvatarWithTitle';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { format } from 'date-fns';
import ReportType from 'enums/reportType.enum';
import { getReports } from 'features/report/reportsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Account from 'models/account.model';
import ExamRoom from 'models/examRoom.model';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ReportPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [page, setPage] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const { showErrorMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { reports, totalItems },
  } = useAppSelector(state => state.reports);
  const rows: GridRowModel[] = reports.map(report => ({
    ...report,
    id: report.reportId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchReports = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      getReports({
        page,
        search: searchValue,
        sort: sortParam.length > 0 ? sortParam : undefined,
        status:
          filterStatus.length > 0 ? (filterStatus === '1' ? 1 : 2) : undefined,
      }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchReports().catch(error => showErrorMessage(error));
  }, [page, sortModel]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'reportId', hide: true },
    {
      field: 'examRoom',
      sortable: false,
      filterable: false,
      headerName: 'Exam room',
      flex: 0.1,
      minWidth: 220,
      valueFormatter: (params: GridValueFormatterParams) => {
        const examRoom = params.value as ExamRoom;
        return examRoom.examRoomName;
      },
    },
    {
      field: 'reportType',
      filterable: false,
      headerName: 'Type',
      valueFormatter: (params: GridValueFormatterParams) => {
        const reportType = params.value as ReportType;
        return reportType === ReportType.Regulation ? 'Regulation' : 'Incident';
      },
    },
    {
      field: 'reporter',
      headerName: 'Reporter',
      headerAlign: 'center',
      flex: 0.1,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: ({ getValue, id, field }) => {
        const { imageUrl, fullName } = getValue(id, field) as Account;
        return <AvatarWithTitle title={fullName} imageUrl={imageUrl} />;
      },
      align: 'center',
    },
    {
      field: 'reportedUser',
      headerName: 'Reported examinee',
      flex: 0.1,
      minWidth: 150,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: ({ getValue, id, field }) => {
        const { imageUrl, fullName } = getValue(id, field) as Account;
        return <AvatarWithTitle title={fullName} imageUrl={imageUrl} />;
      },
      align: 'center',
    },
    {
      field: 'solution',
      headerName: 'Status',
      sortable: false,
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const isResolved = params.getValue(params.id, params.field);
        const color = isResolved ? green[500] : orange[400];
        const statusText = isResolved ? 'Resolved' : 'Pending';
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
      field: 'createdDate',
      filterable: false,
      headerName: 'Reported at',
      flex: 0.1,
      minWidth: 140,
      valueFormatter: ({ value }: GridValueFormatterParams) =>
        format(new Date(String(value)), 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      minWidth: 130,
      type: 'actions',
      getActions: params => {
        const reportId = params.getValue(params.id, 'reportId') as string;
        return [
          <Button
            variant="text"
            onClick={() => history.push(`${url}/${reportId}`)}
          >
            View detail
          </Button>,
        ];
      },
    },
  ];

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(getReports({ search: inputValue, page: 0 }));
    unwrapResult(result);
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
          <MenuItem key="actived" value="1">
            Pending
          </MenuItem>
          <MenuItem key="disabled" value="2">
            Resolved
          </MenuItem>
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
        <Button variant="contained" size="small" onClick={() => fetchReports()}>
          Apply
        </Button>
      </Stack>
    </Box>
  );

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <div>
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        hasFilter
        filterItems={<FilterItems />}
        isLoading={isLoading}
        title="Manage Reports"
        columns={columns}
        rows={rows}
        page={page}
        handleSearch={handleSearch}
        onPageChange={newPage => setPage(newPage)}
      />
    </div>
  );
};

export default ReportPage;
