import { Edit, EditOff } from '@mui/icons-material';
import { DatePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { semesterSchema } from 'configs/validations';
import SemesterDto from 'dtos/semester.dto';
import { updateSemester } from 'features/semester/detailSemesterSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';

interface Props {
  semester: Semester;
  isLoading: boolean;
}

const SemesterDetailCard = ({ semester, isLoading }: Props) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: SemesterDto = { ...semester };
  const formik = useFormik({
    initialValues,
    validationSchema: semesterSchema,
    onSubmit: async (payload: SemesterDto) => {
      try {
        const result = await dispatch(updateSemester(payload));
        unwrapResult(result);
        showSuccessMessage('Update semester successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const refreshFormValues = async () => {
    if (semester) {
      await formik.setValues({
        ...semester,
      });
    }
  };

  useEffect(() => {
    refreshFormValues().catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester]);

  const handleChangeBeginDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('beginDate', selectedDate);
  };

  const handleChangeEndDate = async (selectedDate: Date | null) => {
    await formik.setFieldValue('endDate', selectedDate);
  };

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Semester information
          </Typography>
        }
        action={
          semester.isActive && (
            <IconButton onClick={() => setIsEditable(prevState => !prevState)}>
              {isEditable ? (
                <EditOff sx={{ fontSize: 20 }} />
              ) : (
                <Edit sx={{ fontSize: 20 }} />
              )}
            </IconButton>
          )
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit} pb={2} noValidate>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                name="semesterName"
                margin="dense"
                label="Name"
                fullWidth
                variant="outlined"
                value={formik.values.semesterName}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!isEditable}
                error={
                  formik.touched.semesterName &&
                  Boolean(formik.errors.semesterName)
                }
                helperText={
                  formik.touched.semesterName && formik.errors.semesterName
                }
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="Begin date"
                value={formik.values.beginDate}
                inputFormat="dd/MM/yyyy"
                disabled={!isEditable}
                onChange={handleChangeBeginDate}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    name="beginDate"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.beginDate &&
                      Boolean(formik.errors.beginDate)
                    }
                    helperText={
                      formik.touched.beginDate && formik.errors.beginDate
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label="End date"
                value={formik.values.endDate}
                inputFormat="dd/MM/yyyy"
                onChange={handleChangeEndDate}
                disabled={!isEditable}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    name="endDate"
                    margin="dense"
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={
                      formik.touched.endDate && Boolean(formik.errors.endDate)
                    }
                    helperText={formik.touched.endDate && formik.errors.endDate}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        {semester.isActive && (
          <>
            <CardActions sx={{ justifyContent: 'center' }}>
              <LoadingButton
                disabled={!isEditable}
                loading={isLoading}
                type="submit"
                variant="contained"
                sx={{ width: 150 }}
              >
                Update
              </LoadingButton>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

export default SemesterDetailCard;
