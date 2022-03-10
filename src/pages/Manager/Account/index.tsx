import { FiberManualRecord, PersonAdd } from '@mui/icons-material';
import {
  Avatar,
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
import AccountDetailDialog from 'components/AccountDetailDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import StringAvatar from 'components/StringAvatar';
import activeStatus from 'configs/constants/activeStatus.constant';
import accountRoles from 'configs/constants/roles.constant';
import Status from 'enums/status.enum';
import {
  activeAccount,
  disableAccount,
  searchAccount,
} from 'features/account/accountsSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const AccountPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { url } = useRouteMatch();
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to disable this account ?`,
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { accounts, totalItems },
  } = useAppSelector(state => state.account);
  const [page, setPage] = useState(0);
  const rows: GridRowModel[] = accounts.map(account => ({
    ...account,
    role: account.role.roleName,
    id: account.appUserId,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const fetchAccount = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    dispatch(
      searchAccount({
        search: searchValue,
        page,
        sort: sortParam.length > 0 ? sortParam : undefined,
        role: filterRole,
        status: filterStatus as unknown as Status,
      }),
    )
      .then(result => unwrapResult(result))
      .catch(error => {
        showErrorMessage(error);
      });
  };

  useEffect(() => {
    fetchAccount();
  }, [page, sortModel]);

  useEffect(() => {
    setOpen(false);
  }, [accounts]);

  const handleDeleteAccount = async (appUserId: string) => {
    try {
      const result = await dispatch(disableAccount(appUserId));
      unwrapResult(result);
      showSuccessMessage('Disable account successfully');
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

  const handleActiveAccount = async (appUserId: string) => {
    try {
      const result = await dispatch(activeAccount(appUserId));
      unwrapResult(result);
      showSuccessMessage('Enable account successfully');
    } catch (error) {
      showErrorMessage(error);
    }
  };

  const showDeleteConfirmation = ({ getValue, id }: GridRowParams) => {
    const appUserId = String(getValue(id, 'appUserId'));
    const companyId = String(getValue(id, 'companyId'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to disable account ${companyId}`,
      handleAccept: () => handleDeleteAccount(appUserId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'appUserId', hide: true },
    {
      field: 'imageUrl',
      sortable: false,
      filterable: false,
      renderCell: params => {
        const imageUrl = String(params.getValue(params.id, 'imageUrl'));
        const fullName = String(params.getValue(params.id, 'fullName'));
        return (
          <>
            {imageUrl ? (
              <Avatar alt={fullName} src={imageUrl} />
            ) : (
              <StringAvatar name={fullName} sx={{ justifyContent: 'center' }} />
            )}
          </>
        );
      },
      align: 'center',
      headerName: '',
      flex: 0.05,
      minWidth: 64,
    },
    {
      field: 'companyId',
      headerName: 'ID',
      flex: 0.1,
      minWidth: 130,
    },
    { field: 'fullName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'role',
      headerName: 'Role',
      flex: 0.1,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 0.1,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.2,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, 'isActive');
        const color = active ? green[500] : red[500];
        return (
          <Box display="flex" alignItems="center">
            <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
            <Typography variant="subtitle1" color={color}>
              {active ? 'Active' : 'Inactive'}
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
        const appUserId = String(params.getValue(params.id, 'appUserId'));
        const status = params.getValue(params.id, 'isActive');
        if (!status)
          return [
            <GridActionsCellItem
              label="View detail"
              showInMenu
              onClick={() => history.push(`${url}/${appUserId}`)}
            />,
            <GridActionsCellItem
              label="Enable"
              sx={{ color: green[500] }}
              showInMenu
              onClick={() => handleActiveAccount(appUserId)}
            />,
          ];
        return [
          <GridActionsCellItem
            label="View detail"
            showInMenu
            onClick={() => history.push(`${url}/${appUserId}`)}
          />,
          <GridActionsCellItem
            label="Edit"
            showInMenu
            onClick={() => history.push(`${url}/${appUserId}?edit=true`)}
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
      startIcon={<PersonAdd />}
      onClick={() => setOpen(true)}
    >
      Create account
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchAccount({ search: inputValue, page: 0 }),
    );
    unwrapResult(result);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
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
          {activeStatus.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="role"
          select
          fullWidth
          size="small"
          margin="dense"
          value={filterRole}
          label="Role"
          InputLabelProps={{
            shrink: true,
          }}
          SelectProps={{
            displayEmpty: true,
          }}
          variant="outlined"
          onChange={event => setFilterRole(event.target.value)}
        >
          <MenuItem key="all-role" value="">
            All roles
          </MenuItem>
          {accountRoles.map(option => (
            <MenuItem key={option.roleName} value={option.roleName}>
              {option.roleName}
            </MenuItem>
          ))}
        </TextField>
      </Stack>
      <Stack direction="row" sx={{ marginTop: 1 }} justifyContent="flex-end">
        <Button
          variant="text"
          sx={{ marginRight: 1 }}
          size="small"
          onClick={() => {
            setFilterStatus('');
            setFilterRole('');
          }}
        >
          Reset
        </Button>
        <Button variant="contained" size="small" onClick={() => fetchAccount()}>
          Apply
        </Button>
      </Stack>
    </Box>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} loading={isLoading} />
      <AccountDetailDialog open={open} handleClose={() => setOpen(false)} />
      <EVDSDataGrid
        pagination
        rowHeight={60}
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        paginationMode="server"
        sortingMode="server"
        sortModel={sortModel}
        onSortModelChange={handleSortModelChange}
        rowCount={totalItems}
        isLoading={isLoading}
        title="Manage Accounts"
        handleSearch={handleSearch}
        hasFilter
        filterItems={<FilterItems />}
        columns={columns}
        rows={rows}
        page={page}
        onPageChange={newPage => setPage(newPage)}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default AccountPage;
