/* eslint-disable prefer-destructuring */
import { FiberManualRecord } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import {
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridSortModel,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import EVDSDataGrid from 'components/EVDSDataGrid';
import ExamineeDetailCard from 'components/ExamineeDetailCard';
import ExamineePieChart, {
  ExamineePieChartProps,
} from 'components/ExamineePieChart';
import RemoveExamineeDialog from 'components/RemoveExamineeDialog';
import ExamineeStatus from 'enums/examineeStatus.enum';
import { getExamineeSubjectDetail } from 'features/subjectExaminee/detailExamineeSubjectSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import React, { useEffect, useState } from 'react';

const DetailExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { examineeSubject, isLoading, shouldRefresh } = useAppSelector(
    state => state.detailSubjectExaminee,
  );
  const query = useQuery();
  const subjectSemesterId = query.get('subjectSemesterId');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [chartData, setChartData] = useState<ExamineePieChartProps | null>(
    null,
  );
  const [title, setTitle] = useState<null | string>(null);
  const [initialValue, setInitialValue] = useState<string | null>();
  const [subjectExamineeId, setSubjectExamineeId] = useState<null | string>(
    null,
  );
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchDetailExamineeSubject = () => {
    let sortParam = '';
    if (sortModel.length > 0) {
      const { field, sort } = sortModel[0];
      sortParam = `${field},${String(sort)}`;
    }
    if (subjectSemesterId)
      dispatch(
        getExamineeSubjectDetail({
          subjectSemesterId,
          search: searchValue,
          page,
          sort: sortParam,
        }),
      )
        .then(result => {
          const subjectExaminees = unwrapResult(result);
          if (chartData === null || shouldRefresh) {
            const { totalAssigned, totalExempted, totalUnassigned } =
              subjectExaminees;
            setChartData({
              totalAssigned,
              totalRemoved: totalExempted,
              totalUnassigned,
            });
          }
          return subjectExaminees;
        })
        .catch(error => showErrorMessage(error));
  };

  useEffect(() => {
    fetchDetailExamineeSubject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue, page, shouldRefresh]);

  const rows: GridRowModel[] = examineeSubject
    ? examineeSubject.examinees.map(examinee => ({
        ...examinee.examinee,
        removedReason: examinee.removedReason,
        id: examinee.examinee.appUserId,
        status: examinee.status,
        subjectExamineeId: examinee.subjectExamineeId,
      }))
    : [];

  const handleRemoveExaminee = (
    companyId: string,
    currentSubjectExamineeId: string,
  ) => {
    handleClickOpen();
    setTitle(`Remove ${companyId} from list ?`);
    setInitialValue(null);
    setSubjectExamineeId(currentSubjectExamineeId);
  };

  const handleViewReason = (
    currentSubjectExamineeId: string,
    reason: string | null,
  ) => {
    handleClickOpen();
    setTitle(`Removed reason`);
    setInitialValue(reason);
    setSubjectExamineeId(currentSubjectExamineeId);
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'appUserId', hide: true },
    { field: 'subjectExamineeId', hide: true },
    { field: 'removedReason', hide: true },
    {
      field: 'imageUrl',
      headerName: '',
      sortable: false,
      filterable: false,
      renderCell: params => {
        const imageUrl = String(params.getValue(params.id, 'imageUrl'));
        const fullName = String(params.getValue(params.id, 'fullName'));
        return <Avatar alt={fullName} src={imageUrl} />;
      },
    },
    { field: 'companyId', headerName: 'ID', flex: 0.06, minWidth: 100 },
    { field: 'fullName', headerName: 'Full name', flex: 0.1, minWidth: 200 },
    {
      field: 'phoneNumber',
      headerName: 'Phone number',
      flex: 0.1,
      minWidth: 130,
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: params => {
        const status = params.getValue(params.id, params.field);
        let color = '#1890ff';
        let statusText = 'Unknown';
        switch (status) {
          case ExamineeStatus.Unassigned:
            color = orange[400];
            statusText = 'Unassigned';
            break;

          case ExamineeStatus.Assigned:
            color = green[500];
            statusText = 'Assigned';
            break;

          case ExamineeStatus.Removed:
            color = red[500];
            statusText = 'Removed';
            break;

          default:
            break;
        }
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
      headerName: 'Action',
      type: 'actions',
      sortable: false,
      minWidth: 130,
      flex: 0.1,
      getActions: ({ getValue, id }) => {
        const status = getValue(id, 'status') as ExamineeStatus;
        const reason = getValue(id, 'removedReason') as string | null;
        const companyId = String(getValue(id, 'companyId'));
        const rowSubjectExamineeId = String(getValue(id, 'subjectExamineeId'));
        return status !== ExamineeStatus.Removed
          ? [
              <Button
                variant="text"
                onClick={() => {
                  handleRemoveExaminee(companyId, rowSubjectExamineeId);
                }}
              >
                Remove
              </Button>,
            ]
          : [
              <Button
                variant="text"
                onClick={() => {
                  handleViewReason(rowSubjectExamineeId, reason);
                }}
              >
                View reason
              </Button>,
            ];
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
      <RemoveExamineeDialog
        initialValue={initialValue}
        subjectExamineeId={subjectExamineeId}
        title={title}
        open={open}
        handleClose={handleClose}
      />
      <BackToPreviousPageButton
        title="Back to examinee page"
        route="/shift-manager/examinees"
      />
      <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
        <Grid item xs={12} md={9} lg={3}>
          <Stack spacing={3}>
            {examineeSubject && (
              <ExamineeDetailCard examineeSubject={examineeSubject} />
            )}
            {chartData &&
              chartData.totalAssigned +
                chartData.totalUnassigned +
                chartData.totalRemoved >
                0 && (
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
                    {chartData.totalAssigned +
                      chartData.totalUnassigned +
                      chartData.totalRemoved >
                    0 ? (
                      <ExamineePieChart {...chartData} />
                    ) : (
                      <Typography>No examinees yet</Typography>
                    )}
                  </CardContent>
                </Card>
              )}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={9}>
          {examineeSubject && (
            <EVDSDataGrid
              pagination
              paginationMode="server"
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
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default DetailExamineePage;
