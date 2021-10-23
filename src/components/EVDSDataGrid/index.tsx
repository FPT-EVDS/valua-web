/* eslint-disable react/require-default-props */
import { FilterAlt, Search } from '@mui/icons-material';
import {
  alpha,
  Box,
  Button,
  Grid,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuProps,
  styled,
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
  leftActions?: React.ReactNode;
  filterItems?: React.ReactNode;
  hasFilter?: boolean;
  hasSearch?: boolean;
  handleSearch?: (searchValue: string) => void;
}

interface CustomDataGridProps extends DataGridHeaderProps, DataGridProps {
  isLoading: boolean;
  rows: GridRowData[];
  columns: GridColumns;
}

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 200,
    padding: 8,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const EVDSDataGridHeader = ({
  title,
  addButton,
  hasFilter,
  hasSearch,
  handleSearch,
  filterItems,
  leftActions,
}: DataGridHeaderProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Grid item display="flex" alignItems="center">
        <Typography variant="h5" component="div" sx={{ marginRight: 2 }}>
          {title}
        </Typography>
        <Box sx={{ width: 200 }}>{leftActions}</Box>
      </Grid>
      <Grid item>
        <Grid container spacing={2} alignItems="center">
          {hasSearch && (
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
          )}
          {hasFilter && (
            <Grid item alignItems="stretch" display="flex">
              <Button
                variant="outlined"
                startIcon={<FilterAlt />}
                id="demo-customized-button"
                aria-controls="demo-customized-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                disableElevation
                onClick={handleClick}
              >
                Filter
              </Button>
              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                {filterItems}
              </StyledMenu>
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
  filterItems,
  leftActions,
  handleSearch,
  ...otherProps
}: CustomDataGridProps) => (
  <>
    <EVDSDataGridHeader
      title={title}
      addButton={addButton}
      hasFilter={hasFilter}
      filterItems={filterItems}
      handleSearch={handleSearch}
      leftActions={leftActions}
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
