/* eslint-disable react/require-default-props */
import { FilterAlt, Search } from '@mui/icons-material';
import {
  Button,
  Grid,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  DataGridProps,
  GridColumns,
  GridOverlay,
  GridRowData,
} from '@mui/x-data-grid';
import CustomNoRowsOverlay from 'components/CustomNoRowsOverlay';
import React, { useState } from 'react';

interface DataGridHeaderProps {
  title: string;
  addButton: React.ReactNode;
  hasFilter?: boolean;
  handleSearch?: (searchValue: string) => void;
}

interface CustomDataGridProps extends DataGridHeaderProps, DataGridProps {
  isLoading: boolean;
  rows: GridRowData[];
  columns: GridColumns;
  hasFilter?: boolean;
}

const EVDSDataGridHeader = ({
  title,
  addButton,
  hasFilter,
  handleSearch,
}: DataGridHeaderProps) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const handleOnKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && handleSearch) {
      handleSearch(searchValue);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center" mb={2}>
      <Grid item>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              placeholder="Search here..."
              type="search"
              size="small"
              onKeyDown={handleOnKeyDown}
              onChange={handleChange}
              value={searchValue}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ width: 20, height: 20 }} />
                  </InputAdornment>
                ),
              }}
            />
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
};

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const EVDSDataGrid = ({
  isLoading,
  rows,
  columns,
  title,
  addButton,
  hasFilter = false,
  handleSearch,
  ...otherProps
}: CustomDataGridProps) => (
  <>
    <EVDSDataGridHeader
      title={title}
      addButton={addButton}
      hasFilter={hasFilter}
      handleSearch={handleSearch}
    />
    <div style={{ height: 650, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            {...otherProps}
            loading={isLoading}
            disableSelectionOnClick
            disableColumnMenu
            disableColumnFilter
            disableColumnSelector
            rows={rows}
            columns={columns}
            components={{
              LoadingOverlay: CustomLoadingOverlay,
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </div>
      </div>
    </div>
  </>
);

export default EVDSDataGrid;
