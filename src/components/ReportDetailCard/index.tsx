import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { resolveReportSchema } from 'configs/validations';
import ReportType from 'enums/reportType.enum';
import { resolveReport } from 'features/report/detailReportSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Report from 'models/report.model';
import React, { useEffect, useState } from 'react';

interface DetailReportCardProps {
  report: Report;
  isLoading: boolean;
}

const ReportDetailCard = ({ report, isLoading }: DetailReportCardProps) => {
  const initialValues = {
    solution: report.solution || '',
  };
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const [isDisabled, setIsDisabled] = useState(!!report.solution);
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues,
    validationSchema: resolveReportSchema,
    onSubmit: async ({ solution }) => {
      try {
        const result = await dispatch(
          resolveReport({
            reportId: report.reportId,
            solution,
          }),
        );
        unwrapResult(result);
        showSuccessMessage('Resolve report successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const refreshFormField = async () => {
    await formik.setFieldValue('solution', report.solution || '');
  };

  useEffect(() => {
    setIsDisabled(!!report.solution);
    refreshFormField().catch(error => showErrorMessage(error));
  }, [report]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography sx={{ fontWeight: 'medium', fontSize: 20 }} variant="h5">
            Report information
          </Typography>
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="description"
                minRows={2}
                margin="dense"
                fullWidth
                multiline
                label="Description"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
                value={report.description}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                minRows={2}
                margin="dense"
                fullWidth
                multiline
                label="Note"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={report.note || 'N/A'}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="solution"
                required
                margin="dense"
                fullWidth
                multiline
                disabled={isDisabled}
                label="Solution"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formik.values.solution}
                minRows={3}
                error={
                  formik.touched.solution && Boolean(formik.errors.solution)
                }
                helperText={formik.touched.solution && formik.errors.solution}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              {report.reportType === ReportType.Violation && (
                <Stack>
                  <Typography color="text.secondary">
                    Reported examinee:
                  </Typography>
                  <ListItem disableGutters disablePadding>
                    <ListItemAvatar>
                      <Avatar
                        src={String(report.reportedUser?.imageUrl)}
                        alt={report.reportedUser?.fullName}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={report.reportedUser?.fullName}
                      secondary={report.reportedUser?.companyId}
                    />
                  </ListItem>
                </Stack>
              )}
            </Grid>
          </Grid>
        </CardContent>
        {!report.solution && (
          <CardActions>
            <LoadingButton
              loading={isLoading}
              type="submit"
              variant="contained"
            >
              Resolve
            </LoadingButton>
          </CardActions>
        )}
      </Box>
    </Card>
  );
};

export default ReportDetailCard;
