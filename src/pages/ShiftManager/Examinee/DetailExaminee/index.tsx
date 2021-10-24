import { ChevronLeft, FiberManualRecord } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
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
import EVDSDataGrid from 'components/EVDSDataGrid';
import ExamineeDetailCard from 'components/ExamineeDetailCard';
import ExamineePieChart from 'components/ExamineePieChart';
import StringAvatar from 'components/StringAvatar';
import { getExamineeSubjectDetail } from 'features/subjectExaminee/detailExamineeSubjectSlice';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const DetailExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { examineeSubject, isLoading } = useAppSelector(
    state => state.detailSubjectExaminee,
  );
  const history = useHistory();
  const query = useQuery();
  const semesterId = query.get('semesterId');
  const subjectId = query.get('subjectId');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const fetchSemester = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    if (semesterId && subjectId)
      dispatch(
        getExamineeSubjectDetail({
          semesterId,
          subjectId,
          search: searchValue,
          page,
          sort: sortParam,
        }),
      )
        .then(result => unwrapResult(result))
        .catch(error =>
          enqueueSnackbar(error, {
            variant: 'error',
            preventDuplicate: true,
          }),
        );
  };

  useEffect(() => {
    fetchSemester();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, page]);

  const rows: GridRowModel[] = examineeSubject
    ? examineeSubject.examinees.map(examinee => ({
        ...examinee.examinee,
        id: examinee.examinee.appUserId,
        isAssigned: examinee.isAssigned,
      }))
    : [];

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'appUserId', hide: true },
    {
      field: 'imageUrl',
      headerName: '',
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
    },
    { field: 'companyId', headerName: 'ID', flex: 0.1, minWidth: 130 },
    { field: 'fullName', headerName: 'Full name', flex: 0.1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 0.1, minWidth: 130 },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      flex: 0.1,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const active = params.getValue(params.id, params.field);
        const color = active ? green[500] : red[500];
        const statusText = active ? 'Assigned' : 'Not assigned';
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
  ];

  const handleSearch = async (inputValue: string) => {
    setSearchValue(inputValue);
  };

  const handleSortModelChange = (newModel: GridSortModel) => {
    setSortModel(newModel);
  };

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        onClick={() => history.push('/shift-manager/examinee')}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to examinee page</div>
      </Box>
      <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
        {examineeSubject && (
          <>
            <Grid item xs={12} md={9} lg={3}>
              <Stack spacing={3}>
                <ExamineeDetailCard examineeSubject={examineeSubject} />
                <Card sx={{ minWidth: 275 }} elevation={2}>
                  <CardHeader
                    title={
                      <Typography
                        sx={{ fontWeight: 'medium', fontSize: 16 }}
                        variant="h5"
                        gutterBottom
                      >
                        Examinee&apos;s information
                      </Typography>
                    }
                  />
                  <CardContent sx={{ height: 300 }}>
                    <ExamineePieChart
                      totalExaminees={examineeSubject.totalItems}
                      totalUnassigned={examineeSubject.totalUnassignedExaminees}
                    />
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} lg={9}>
              <EVDSDataGrid
                pagination
                rowHeight={60}
                rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
                pageSize={DEFAULT_PAGE_SIZE}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                rowCount={examineeSubject.totalItems}
                isLoading={isLoading}
                title="Examinee list"
                handleSearch={handleSearch}
                columns={columns}
                rows={rows}
                page={page}
                onPageChange={newPage => setPage(newPage)}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailExamineePage;
