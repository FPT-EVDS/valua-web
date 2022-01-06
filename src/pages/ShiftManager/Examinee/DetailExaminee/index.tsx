/* eslint-disable prefer-destructuring */
import { Close, FiberManualRecord } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
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
import StringAvatar from 'components/StringAvatar';
import { removeExamineeSchema } from 'configs/validations';
import RemoveExamineeDto from 'dtos/removeExaminee.dto';
import ExamineeStatus from 'enums/examineeStatus.enum';
import {
  getExamineeSubjectDetail,
  removeExaminee,
} from 'features/subjectExaminee/detailExamineeSubjectSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface RemoveExamineeDialogProps {
  subjectExamineeId: string | null;
  title: string | null;
  open: boolean;
  handleClose: () => void;
}

const RemoveExamineeDialog = ({
  subjectExamineeId,
  open,
  handleClose,
  title,
}: RemoveExamineeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      removedReason: '',
      subjectExamineeId: subjectExamineeId || '',
    },
    validationSchema: removeExamineeSchema,
    onSubmit: async (payload: RemoveExamineeDto) => {
      setIsLoading(true);
      if (subjectExamineeId) {
        try {
          const result = await dispatch(removeExaminee(payload));
          unwrapResult(result);
          showSuccessMessage('Remove examinee success');
        } catch (error) {
          showErrorMessage('Can not remove this examinee');
        } finally {
          setIsLoading(false);
          formik.resetForm();
          handleClose();
        }
      }
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    handleClose();
  };

  useEffect(() => {
    const refreshSubjectExamineeId = async (): Promise<void> => {
      await formik.setFieldValue('subjectExamineeId', subjectExamineeId);
    };
    // eslint-disable-next-line no-void
    void refreshSubjectExamineeId();
  }, [subjectExamineeId]);

  return (
    <div>
      <Dialog open={open} onClose={handleCloseModal} fullWidth>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {title || 'Confirm remove'}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              name="removedReason"
              value={formik.values.removedReason}
              multiline
              rows={4}
              autoFocus
              margin="dense"
              placeholder="Specify the remove reason here"
              helperText="Reason must be 8 - 50 chars long"
              type="email"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              variant="outlined"
              error={
                formik.touched.removedReason &&
                Boolean(formik.errors.removedReason)
              }
            />
          </DialogContent>
          <DialogActions>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button type="submit">Confirm</Button>
              </>
            )}
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

const DetailExamineePage = () => {
  const DEFAULT_PAGE_SIZE = 20;
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { examineeSubject, isLoading, shouldRefresh } = useAppSelector(
    state => state.detailSubjectExaminee,
  );
  const query = useQuery();
  const semesterId = query.get('semesterId');
  const subjectId = query.get('subjectId');
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [chartData, setChartData] = useState<ExamineePieChartProps | null>(
    null,
  );
  const [title, setTitle] = useState<null | string>(null);
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
        .then(result => {
          const subjectExaminees = unwrapResult(result);
          if (chartData === null || shouldRefresh) {
            const { totalUnassignedExaminees, examinees, totalItems } =
              subjectExaminees;
            const totalAssigned = examinees.filter(
              value => value.status === ExamineeStatus.Assigned,
            ).length;
            setChartData({
              totalAssigned,
              totalRemoved:
                totalItems - totalUnassignedExaminees - totalAssigned,
              totalUnassigned: totalUnassignedExaminees,
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
        id: examinee.examinee.appUserId,
        status: examinee.status,
        subjectExamineeId: examinee.subjectExamineeID,
      }))
    : [];

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'appUserId', hide: true },
    { field: 'subjectExamineeId', hide: true },
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
    { field: 'fullName', headerName: 'Full name', flex: 0.2, minWidth: 250 },
    { field: 'email', headerName: 'Email', flex: 0.2, minWidth: 250 },
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
        return status !== ExamineeStatus.Removed
          ? [
              <Button
                variant="text"
                onClick={() => {
                  handleClickOpen();
                  setTitle(
                    `Remove ${String(getValue(id, 'companyId'))} from list ?`,
                  );
                  setSubjectExamineeId(
                    String(getValue(id, 'subjectExamineeId')),
                  );
                }}
              >
                Remove
              </Button>,
            ]
          : [];
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
        subjectExamineeId={subjectExamineeId}
        title={title}
        open={open}
        handleClose={handleClose}
      />
      <BackToPreviousPageButton
        title="Back to examinee page"
        route="/shift-manager/examinee"
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
