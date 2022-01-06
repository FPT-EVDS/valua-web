/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
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
import ToolDetailDialog from 'components/ToolDetailDialog';
import ToolDto from 'dtos/tool.dto';
import {
  activeTool,
  disableTool,
  searchByToolName,
} from 'features/tool/toolsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';

const ToolPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [page, setPage] = React.useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this tool ?`,
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
    current: { tools, totalItems },
  } = useAppSelector(state => state.tools);
  const rows: GridRowModel[] = tools.map(tool => ({
    ...tool,
    id: tool.toolId,
  }));
  const [initialValues, setInitialValues] = useState<ToolDto>({
    toolId: null,
    toolCode: '',
    toolName: '',
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTools = async () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    const actionResult = await dispatch(
      searchByToolName({
        page,
        search: searchValue,
        sort: sortParam.length > 0 ? sortParam : undefined,
        status:
          filterStatus.length > 0 ? (filterStatus === '1' ? 1 : 0) : undefined,
      }),
    );
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchTools().catch(error => showErrorMessage(error));
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [tools]);

  const handleActiveTool = async (toolId: string) => {
    try {
      const result = await dispatch(activeTool(toolId));
      unwrapResult(result);
      showSuccessMessage('Enable tool successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    try {
      const result = await dispatch(disableTool(toolId));
      unwrapResult(result);
      showSuccessMessage('Disable tool successfully');
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
    const toolId = String(getValue(id, 'toolId'));
    const name = String(getValue(id, 'toolName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to disable ${name}`,
      handleAccept: () => handleDeleteTool(toolId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'toolId', hide: true },
    {
      field: 'toolCode',
      headerName: 'Tool code',
      flex: 0.1,
      minWidth: 130,
    },
    {
      field: 'toolName',
      headerName: 'Name',
      flex: 0.1,
      minWidth: 130,
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
        const isActiveTool = params.getValue(params.id, 'isActive');
        const toolId = String(params.getValue(params.id, 'toolId'));
        if (!isActiveTool) {
          return [
            <GridActionsCellItem
              label="View detail"
              showInMenu
              onClick={() => {
                setIsActive(false);
                setIsUpdate(false);
                setInitialValues(params.row as ToolDto);
                setOpen(true);
              }}
            />,
            <GridActionsCellItem
              label="Enable"
              sx={{ color: green[500] }}
              showInMenu
              onClick={() => handleActiveTool(toolId)}
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
              setInitialValues(params.row as ToolDto);
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
      Create tool
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchByToolName({ search: inputValue, page: 0 }),
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
          <MenuItem key="disabled" value="2">
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
        <Button variant="contained" size="small" onClick={() => fetchTools()}>
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
      <ToolDetailDialog
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
        title="Manage Tools"
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

export default ToolPage;
