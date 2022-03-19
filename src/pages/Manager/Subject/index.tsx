/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord, InfoOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { styled } from '@mui/styles';
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
import SubjectDetailDialog from 'components/SubjectDetailDialog';
import SubjectDto from 'dtos/subject.dto';
import Status from 'enums/status.enum';
import {
  activeSubject,
  disableSubject,
  searchBySubjectName,
} from 'features/subject/subjectsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Tool from 'models/tool.model';
import React, { useEffect, useState } from 'react';

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200,
  },
});

const SubjectPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [page, setPage] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this subject ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { subjects, totalItems },
  } = useAppSelector(state => state.subjects);
  const rows: GridRowModel[] = subjects.map(subject => ({
    ...subject,
    id: subject.subjectId,
  }));
  const [initialValues, setInitialValues] = useState<SubjectDto>({
    subjectId: null,
    subjectCode: '',
    subjectName: '',
    numberOfExam: 1,
    tools: [],
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchSubjects = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      searchBySubjectName({
        page,
        search: searchValue,
        sort: sortParam.length > 0 ? sortParam : undefined,
        status: filterStatus as unknown as Status,
      }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchSubjects().catch(error => showErrorMessage(error));
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [subjects]);

  const handleActiveSubject = async (subjectId: string) => {
    try {
      const result = await dispatch(activeSubject(subjectId));
      unwrapResult(result);
      showSuccessMessage('Enable subject successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const handleDeleteSubject = async (subject: string) => {
    try {
      const result = await dispatch(disableSubject(subject));
      unwrapResult(result);
      showSuccessMessage('Disable subject successfully');
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
    const subjectId = String(getValue(id, 'subjectId'));
    const name = String(getValue(id, 'subjectName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to disable subject ${name}`,
      handleAccept: () => handleDeleteSubject(subjectId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'subjectId', hide: true },
    {
      field: 'subjectCode',
      headerName: 'Subject Code',
      flex: 0.1,
      minWidth: 130,
    },
    { field: 'subjectName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'numberOfExam',
      headerName: 'Number of exams',
      flex: 0.05,
      minWidth: 130,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'tools',
      headerName: 'Allowed tools',
      flex: 0.1,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ id, field, getValue }) => {
        const tools = getValue(id, field) as Tool[];
        let tooltipText = 'No tools allowed';
        if (tools.length > 0) {
          tooltipText = tools.map(tool => tool.toolName).join(', ');
        }
        return (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2">{tools.length}</Typography>
            {tools.length > 0 && (
              <CustomWidthTooltip title={tooltipText} arrow>
                <InfoOutlined fontSize="small" color="info" />
              </CustomWidthTooltip>
            )}
          </Stack>
        );
      },
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
        const subjectStatus = params.getValue(params.id, 'isActive');
        const subjectId = String(params.getValue(params.id, 'subjectId'));
        if (!subjectStatus) {
          return [
            <GridActionsCellItem
              label="View detail"
              showInMenu
              onClick={() => {
                setIsActive(false);
                setIsUpdate(false);
                setInitialValues(params.row as SubjectDto);
                setOpen(true);
              }}
            />,
            <GridActionsCellItem
              label="Enable"
              sx={{ color: green[500] }}
              showInMenu
              onClick={() => handleActiveSubject(subjectId)}
            />,
          ];
        }
        return [
          <GridActionsCellItem
            label="Edit"
            showInMenu
            onClick={() => {
              setIsActive(true);
              setIsUpdate(true);
              setInitialValues(params.row as SubjectDto);
              setOpen(true);
            }}
          />,
          <GridActionsCellItem
            label="Disable"
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
        setIsActive(true);
        setOpen(true);
        setIsUpdate(false);
      }}
    >
      Create subject
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchBySubjectName({ search: inputValue, page: 0 }),
    );
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
            Active
          </MenuItem>
          <MenuItem key="disabled" value="0">
            Inactive
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
          onClick={() => fetchSubjects()}
        >
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
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <SubjectDetailDialog
        open={open}
        isActive={isActive}
        handleClose={() => setOpen(false)}
        isUpdate={isUpdate}
        initialValues={initialValues}
      />
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
        title="Manage Subjects"
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

export default SubjectPage;
