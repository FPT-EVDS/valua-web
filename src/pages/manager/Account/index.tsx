import { Delete, Description, Edit, PersonAdd } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AccountDetailDialog from 'components/AccountDetailDialog';
import StringAvatar from 'components/StringAvatar';
import { disableAccount, getAccounts } from 'features/account/accountSlice';
import React, { useEffect, useState } from 'react';

const Account = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(state => state.account.current.accounts);
  const rows: GridRowModel[] = accounts.map(account => ({
    ...account,
    role: account.role.roleName,
    id: account.appUserId,
  }));

  const handleDeleteAccount = async (appUserId: string) => {
    // TODO: Show confirm
    try {
      const result = await dispatch(disableAccount(appUserId));
      unwrapResult(result);
    } catch (error) {
      console.log(error);
    }
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'appUserId', hide: true },
    {
      field: 'imageUrl',
      sortable: false,
      filterable: false,
      renderCell: params => (
        <StringAvatar
          name={String(params.getValue(params.id, 'fullName'))}
          sx={{ justifyContent: 'center' }}
        />
      ),
      align: 'center',
      headerName: '',
      flex: 0.05,
      minWidth: 64,
    },
    { field: 'fullName', headerName: 'Name', flex: 0.2, minWidth: 130 },
    { field: 'role', headerName: 'Role', flex: 0.1, minWidth: 130 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 0.2, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 130 },
    { field: 'isActive', headerName: 'Status', flex: 0.1, minWidth: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: params => [
        <GridActionsCellItem
          label="Delete"
          icon={<Delete />}
          showInMenu
          onClick={() =>
            handleDeleteAccount(String(params.getValue(params.id, 'appUserId')))
          }
        />,
        <GridActionsCellItem label="Edit" icon={<Edit />} showInMenu />,
        <GridActionsCellItem
          label="View detail"
          icon={<Description />}
          showInMenu
        />,
      ],
    },
  ];

  const fetchAccount = async (numOfPage: number) => {
    const actionResult = await dispatch(getAccounts(numOfPage));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchAccount(0).catch(error => console.log(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        variant="text"
        startIcon={<PersonAdd />}
        sx={{ ml: 'auto' }}
        onClick={() => setOpen(true)}
      >
        Add account
      </Button>
    </GridToolbarContainer>
  );

  return (
    <div>
      <AccountDetailDialog
        title="Create account"
        open={open}
        handleClose={() => setOpen(false)}
      />
      <Typography variant="h5" component="div" sx={{ mb: 4 }}>
        Manage Accounts
      </Typography>
      <div style={{ height: 600, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              disableSelectionOnClick
              rows={rows}
              columns={columns}
              components={{
                Toolbar: CustomToolbar,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
