import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { AxiosError } from 'axios';
import SubjectExamineeSemesterDropdown from 'components/SubjectExamineeSemesterDropdown';
import { addExamRoomSchema } from 'configs/validations';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import {
  getAvailableExaminees,
  getShift,
  updateCurrentSubject,
} from 'features/examRoom/addExamRoomSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';

interface Props {
  shiftId: string;
  handleSubmit: (payload: GetAvailableExamineesDto) => Promise<void>;
  handleError: () => void;
}

const GetAvailableExamRoomsCard = ({
  shiftId,
  handleSubmit,
  handleError,
}: Props) => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { shift } = useAppSelector(state => state.addExamRoom);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);

  const fetchShift = async (id: string) => {
    const actionResult = await dispatch(getShift(id));
    unwrapResult(actionResult);
  };

  const formik = useFormik({
    initialValues: {
      shiftId,
      subjectSemesterId: '',
      numOfRooms: 1,
    },
    validationSchema: addExamRoomSchema,
    onSubmit: async ({ shiftId: id, subjectSemesterId }) => {
      setIsLoading(true);
      try {
        await handleSubmit({ shiftId: id, subjectSemesterId });
        setIsLoading(false);
      } catch (error) {
        handleError();
        showErrorMessage(error);
        setIsLoading(false);
      }
    },
  });

  const handleChangeSubject = async (
    selectedSubject: {
      semester: Pick<Semester, 'semesterId' | 'semesterName'>;
      subject: Subject;
      subjectSemesterId: string;
    } | null,
  ) => {
    await formik.setFieldValue(
      'subjectSemesterId',
      selectedSubject?.subjectSemesterId,
    );
    dispatch(updateCurrentSubject(selectedSubject));
    try {
      if (shift && selectedSubject) {
        const result = await dispatch(
          getAvailableExaminees({
            shiftId: String(shift.shiftId),
            subjectSemesterId: selectedSubject.subjectSemesterId,
          }),
        );
        // reset state
        handleError();
        unwrapResult(result);
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
                shiftId={String(shift?.shiftId)}
                helperText={formik.errors.subjectSemesterId}
                error={Boolean(formik.errors.subjectSemesterId)}
                onChange={handleChangeSubject}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <LoadingButton
            variant="contained"
            type="submit"
            disabled={
              isDisable ||
              isLoading ||
              formik.values.subjectSemesterId.length === 0
            }
            loading={isLoading}
          >
            Assign examinee
          </LoadingButton>
        </CardActions>
      </Box>
    </Card>
  );
};

export default GetAvailableExamRoomsCard;
