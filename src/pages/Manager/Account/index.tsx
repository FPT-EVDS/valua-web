import {
  Delete,
  Description,
  Edit,
  FiberManualRecord,
  PersonAdd,
} from '@mui/icons-material';
import { Avatar, Box, Button, Typography } from '@mui/material';
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
import AccountDetailDialog from 'components/AccountDetailDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import StringAvatar from 'components/StringAvatar';
import {
  disableAccount,
  searchByFullName,
} from 'features/account/accountsSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

const AccountPage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { url } = useRouteMatch();
  const [searchValue, setSearchValue] = useState('');
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this account ?`,
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
    current: { accounts, totalItems },
  } = useAppSelector(state => state.account);
  const [page, setPage] = React.useState(0);
  const rows: GridRowModel[] = accounts.map(account => ({
    ...account,
    role: account.role.roleName,
    id: account.appUserId,
  }));

  const fetchAccount = async (name: string, numOfPage: number) => {
    const actionResult = await dispatch(searchByFullName({ name, numOfPage }));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchAccount(searchValue, page).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    setOpen(false);
  }, [accounts]);

  const handleDeleteAccount = async (appUserId: string) => {
    try {
      const result = await dispatch(disableAccount(appUserId));
      unwrapResult(result);
      enqueueSnackbar('Disable account success', {
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
    const appUserId = String(getValue(id, 'appUserId'));
    const name = String(getValue(id, 'fullName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove account ${name}`,
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
    { field: 'companyId', headerName: 'ID', flex: 0.1, minWidth: 130 },
    { field: 'fullName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    { field: 'role', headerName: 'Role', flex: 0.1, minWidth: 130 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 0.1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 130 },
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
              {active ? 'Active' : 'Disable'}
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
            onClick={() => history.push(`${url}/${appUserId}?edit=true`)}
          />,
          <GridActionsCellItem
            label="View detail"
            icon={<Description />}
            showInMenu
            onClick={() => history.push(`${url}/${appUserId}`)}
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
      startIcon={<PersonAdd />}
      onClick={() => setOpen(true)}
    >
      Add account
    </Button>
  );

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
    const result = await dispatch(
      searchByFullName({ name: inputValue, numOfPage: 0 }),
    );
    unwrapResult(result);
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <AccountDetailDialog open={open} handleClose={() => setOpen(false)} />
      <EVDSDataGrid
        pagination
        paginationMode="server"
        rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
        pageSize={DEFAULT_PAGE_SIZE}
        rowCount={totalItems}
        isLoading={isLoading}
        title="Manage Accounts"
        handleSearch={handleSearch}
        columns={columns}
        rows={rows}
        page={page}
        rowHeight={54}
        onPageChange={newPage => setPage(newPage)}
        addButton={<AddButton />}
      />
    </div>
  );
};

export default AccountPage;
