import { FiberManualRecord } from '@mui/icons-material';
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
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import ImportExcelButton from 'components/ImportExcelButton';
import SemesterDropdown from 'components/SemesterDropdown';
import {
  searchSubjectBySemester,
  updateExamineeSemester,
} from 'features/subjectExaminee/subjectExamineeSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const ExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this subject examinee ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const [page, setPage] = useState(0);
  const { showErrorMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { subjects: examineeSubjects, totalItems },
    selectedSemester,
  } = useAppSelector(state => state.subjectExaminee);
  const rows: GridRowModel[] = examineeSubjects.map(examineeSubject => ({
    ...examineeSubject,
    ...examineeSubject.subject.subject,
    id: examineeSubject.subject.subjectSemesterId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const fetchExamineeSubject = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    if (selectedSemester)
      dispatch(
        searchSubjectBySemester({
          page,
          sort: sortParam,
          search,
          isReady:
            filterStatus.length > 0 ? parseInt(filterStatus, 10) : undefined,
          semesterId: selectedSemester.semesterId,
        }),
      )
        .then(result => unwrapResult(result))
        .catch(error => showErrorMessage(error));
  };

  useEffect(() => {
    fetchExamineeSubject();
  }, [page, sortModel, selectedSemester]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    {
      field: 'subject',
      hide: true,
    },
    {
      field: 'subjectCode',
      headerName: 'Subject code',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ row }) => (row.subject as Subject).subjectCode,
    },
    {
      field: 'subjectName',
      headerName: 'Subject name',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ row }) => (row.subject as Subject).subjectName,
    },
    {
      field: 'totalExaminees',
      flex: 0.1,
      headerName: 'Total examinees',
      align: 'center',
      headerAlign: 'center',
      minWidth: 80,
      sortable: false,
    },
    {
      field: 'totalUnassigned',
      flex: 0.1,
      align: 'center',
      headerAlign: 'center',
      headerName: 'Unassigned',
      minWidth: 80,
      sortable: false,
    },
    {
      field: 'isReady',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ getValue, id, field }) => {
        const isReady = getValue(id, field);
        const color = isReady ? green[500] : red[500];
        const statusText = isReady ? 'Ready' : 'Not ready';
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
      flex: 0.1,
      minWidth: 130,
      type: 'actions',
      getActions: params => {
        const subject = params.getValue(params.id, 'subject') as {
          subject: Pick<Subject, 'subjectId' | 'subjectCode' | 'subjectName'>;
          subjectSemesterId: string;
        };
        return [
          <Button
            variant="text"
            onClick={() =>
              history.push(
                `${url}/subject?subjectSemesterId=${subject.subjectSemesterId}`,
              )
            }
          >
            View detail
          </Button>,
        ];
      },
    },
  ];

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  const handleChangeSemester = (
    semester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => {
    dispatch(updateExamineeSemester(semester));
  };

  const handleSearch = async (searchValue: string) => {
    setSearch(searchValue);
    if (selectedSemester) {
      const result = await dispatch(
        searchSubjectBySemester({
          search: searchValue,
          page: 0,
          semesterId: selectedSemester.semesterId,
        }),
      );
      unwrapResult(result);
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
          onChange={event => setFilterStatus(event.target.value)}
        >
          <MenuItem key="all-status" value="">
            All
          </MenuItem>
          <MenuItem key="all-status" value="1">
            Ready
          </MenuItem>
          <MenuItem key="all-status" value="0">
            Not ready
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
        <Button
          variant="contained"
          size="small"
          onClick={() => fetchExamineeSubject()}
        >
          Apply
        </Button>
      </Stack>
    </Box>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <EVDSDataGrid
        pagination
        rowHeight={60}
        leftActions={
          <SemesterDropdown
            textFieldProps={{
              size: 'small',
            }}
            isEditable
            value={selectedSemester}
            onChange={handleChangeSemester}
          />
        }
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        sortingMode="server"
        paginationMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        rowCount={totalItems}
        isLoading={isLoading}
        hasSearch
        handleSearch={handleSearch}
        hasFilter
        filterItems={<FilterItems />}
        title="Manage Examinee"
        columns={columns}
        page={page}
        onPageChange={newPage => setPage(newPage)}
        rows={rows}
        addButton={<ImportExcelButton />}
      />
    </div>
  );
};

export default ExamineePage;
