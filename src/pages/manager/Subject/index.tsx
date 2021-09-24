import { Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import React from 'react';

const SubjectPage = () => {
  const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'Material-UI', col2: 'is Amazing' },
  ];

  const columns: GridColDef[] = [
    { field: 'col1', headerName: 'Name' },
    { field: 'col2', headerName: 'Floor' },
  ];

  return (
    <div>
      <Typography variant="h5" component="div" sx={{ mb: 4 }}>
        Manage Subject
      </Typography>
      <div style={{ height: 600, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid rows={rows} columns={columns} autoHeight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
