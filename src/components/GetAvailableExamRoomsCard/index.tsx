import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import SubjectExamineeSemesterDropdown from 'components/SubjectExamineeSemesterDropdown';
import { addExamRoomSchema } from 'configs/validations';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import {
  getShift,
  updateCurrentSubject,
} from 'features/examRoom/addExamRoomSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';

interface Props {
  shiftId: string;
  handleSubmit: (payload: GetAvailableExamRoomsDto) => Promise<void>;
  handleGetAvailableExaminees: (
    payload: GetAvailableExamineesDto,
  ) => Promise<void>;
  examinees: AvailableExamineesDto | null;
  handleError: () => void;
}

const GetAvailableExamRoomsCard = ({
  shiftId,
  examinees,
  handleSubmit,
  handleGetAvailableExaminees,
  handleError,
}: Props) => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { shift, defaultExamRoomSize } = useAppSelector(
    state => state.addExamRoom,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);

  const fetchShift = async (id: string) => {
    const actionResult = await dispatch(getShift(id));
    unwrapResult(actionResult);
  };

  const formik = useFormik({
    initialValues: {
      shiftId,
      subjectId: '',
      numOfRooms: 1,
    },
    validationSchema: addExamRoomSchema,
    onSubmit: async ({ shiftId: id, numOfRooms }) => {
      setIsLoading(true);
      try {
        await handleSubmit({ shiftId: id, numOfRooms });
        setIsLoading(false);
      } catch (error) {
        handleError();
        showErrorMessage(error);
        setIsLoading(false);
      }
    },
  });

  const handleChangeSubject = async (
    selectedSubject: Pick<
      Subject,
      'subjectId' | 'subjectName' | 'subjectCode'
    > | null,
  ) => {
    await formik.setFieldValue('subjectId', selectedSubject?.subjectId);
    dispatch(updateCurrentSubject(selectedSubject));
    try {
      if (shift && selectedSubject) {
        await handleGetAvailableExaminees({
          shiftId: String(shift.shiftId),
          subjectId: selectedSubject.subjectId,
        });
        setIsDisable(false);
      }
    } catch (error) {
      handleError();
      const err = error as AxiosError;
      if (err.response) showErrorMessage(err.response.data);
      else showErrorMessage(error);
      setIsDisable(true);
    }
  };

  useEffect(() => {
    if (shiftId) fetchShift(shiftId).catch(error => showErrorMessage(error));
  }, []);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography sx={{ fontSize: 16 }} variant="h5" gutterBottom>
            Please specify a subject for {shift?.semester.semesterName}
          </Typography>
        }
      />
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SubjectExamineeSemesterDropdown
                semesterId={shift?.semester.semesterId}
                helperText={formik.errors.subjectId}
                error={Boolean(formik.errors.subjectId)}
                onChange={handleChangeSubject}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="numOfRooms"
                margin="dense"
                label="Estimate room amount"
                type="number"
                fullWidth
                value={formik.values.numOfRooms}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    min: 1,
                  },
                  endAdornment: (
                    <InputAdornment position="end">rooms</InputAdornment>
                  ),
                }}
                error={
                  formik.touched.numOfRooms && Boolean(formik.errors.numOfRooms)
                }
                helperText={
                  formik.touched.numOfRooms && Boolean(formik.errors.numOfRooms)
                    ? formik.errors.numOfRooms
                    : examinees &&
                      `Recommend room amount is ${Math.ceil(
                        examinees?.totalExaminees / defaultExamRoomSize,
                      )}`
                }
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={
              isDisable || isLoading || examinees?.examinees.length === 0
            }
            loading={isLoading}
          >
            Get available rooms
          </LoadingButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default GetAvailableExamRoomsCard;
