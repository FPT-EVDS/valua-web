/* eslint-disable react/require-default-props */
import { FilterAlt } from '@mui/icons-material';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { DataGrid, GridColumns, GridRowData } from '@mui/x-data-grid';
import React from 'react';

interface DataGridHeaderProps {
  title: string;
  addButton: React.ReactNode;
  hasFilter?: boolean;
}

interface DataGridProps extends DataGridHeaderProps {
  isLoading: boolean;
  rows: GridRowData[];
  columns: GridColumns;
  hasFilter?: boolean;
}

const EVDSDataGridHeader = ({
  title,
  addButton,
  hasFilter,
}: DataGridHeaderProps) => (
  <Grid container justifyContent="space-between" alignItems="center" mb={2}>
    <Grid item>
      <Typography variant="h5" component="div">
        {title}
      </Typography>
    </Grid>
    <Grid item>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField placeholder="Search here..." type="search" size="small" />
        </Grid>
        {hasFilter && (
          <Grid item alignItems="stretch" display="flex">
            <Button variant="outlined" startIcon={<FilterAlt />}>
              Filter
            </Button>
          </Grid>
        )}
        <Grid item alignItems="stretch" display="flex">
          {addButton}
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

const EVDSDataGrid = ({
  isLoading,
  rows,
  columns,
  title,
  addButton,
  hasFilter = false,
}: DataGridProps) => (
  <>
    <EVDSDataGridHeader
      title={title}
      addButton={addButton}
      hasFilter={hasFilter}
    />
    <div style={{ height: 600, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            loading={isLoading}
            autoHeight
            disableSelectionOnClick
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={rows}
            columns={columns}
          />
        </div>
      </div>
    </div>
  </>
);

export default EVDSDataGrid;
