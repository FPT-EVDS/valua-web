/* eslint-disable prefer-destructuring */
import { Edit, EditOff } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { green, orange, red } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import RoomDropdown from 'components/RoomDropdown';
import SemesterSubjectsDropdown from 'components/SemesterSubjectDropdown';
import StaffDropdown from 'components/StaffDropdown';
import { notAllowedEditExamRoomStatuses } from 'configs/constants/shiftConfig.status';
import { detailExamRoomSchema } from 'configs/validations';
import { format } from 'date-fns';
import UpdateExamRoomDto from 'dtos/updateExamRoom.dto';
import ExamRoomStatus from 'enums/examRoomStatus.enum';
import ShiftStatus from 'enums/shiftStatus.enum';
import { updateExamRoom } from 'features/examRoom/detailExamRoomSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import useQuery from 'hooks/useQuery';
import Account from 'models/account.model';
import DetailExamRoom from 'models/detailExamRoom.model';
import Room from 'models/room.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';
import React, { useState } from 'react';

interface Props {
  examRoom: DetailExamRoom;
  shift: Shift;
  handleDelete: (examRoomId: string) => void;
  isLoading: boolean;
}

const ExamRoomDetailCard = ({
  examRoom,
  shift,
  isLoading,
  handleDelete,
}: Props) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );

  let statusColor = '#1890ff';
  let statusText = 'Ready';
  switch (examRoom.status) {
    case ExamRoomStatus.Disabled:
      statusColor = red[500];
      statusText = 'Disabled';
      break;

    case ExamRoomStatus.NotReady:
      statusColor = orange[400];
      statusText = 'Not ready';
      break;

    case ExamRoomStatus.Ready:
      statusColor = green[500];
      statusText = 'Ready';
      break;

    default:
      break;
  }

  const initialValues: UpdateExamRoomDto = {
    examRoomId: examRoom.examRoomId,
    room: examRoom.room,
    staff: examRoom.staff,
    subject: examRoom.subjectSemester.subject,
  };
  const formik = useFormik({
    initialValues,
    validationSchema: detailExamRoomSchema,
    onSubmit: async (payload: UpdateExamRoomDto) => {
      try {
        const result = await dispatch(updateExamRoom(payload));
        unwrapResult(result);
        showSuccessMessage('Update exam room successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

  const handleChangeSubject = async (
    subject: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'> | null,
  ) => {
    await formik.setFieldValue('subject', subject);
  };

  const handleChangeRoom = async (
    room: Pick<
      Room,
      'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'
    > | null,
  ) => {
    await formik.setFieldValue('room', room);
  };

  const handleChangeStaff = async (
    staff: Pick<
      Account,
      | 'appUserId'
      | 'email'
      | 'fullName'
      | 'phoneNumber'
      | 'imageUrl'
      | 'companyId'
    > | null,
  ) => {
    await formik.setFieldValue('staff', staff);
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
            Exam room information
          </Typography>
        }
        action={
          examRoom.status !== ExamRoomStatus.Disabled &&
          !notAllowedEditExamRoomStatuses.has(shift.status) && (
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
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <SemesterSubjectsDropdown
                isEditable={false}
                value={formik.values.subject}
                semesterId={shift.semester.semesterId}
                onChange={handleChangeSubject}
                error={Boolean(formik.errors.subject)}
                helperText={formik.errors.subject?.subjectId}
              />
            </Grid>
            <Grid item xs={12}>
              <StaffDropdown
                isEditable={isEditable}
                onChange={handleChangeStaff}
                shiftId={String(examRoom.shift.shiftId)}
                value={formik.values.staff}
                error={Boolean(formik.errors.staff)}
                helperText={formik.errors.staff?.appUserId}
              />
            </Grid>
            <Grid item xs={12}>
              <RoomDropdown
                isEditable={isEditable && shift.status !== ShiftStatus.Ready}
                onChange={handleChangeRoom}
                shiftId={String(examRoom.shift.shiftId)}
                value={formik.values.room}
                error={Boolean(formik.errors.room)}
                helperText={formik.errors.room?.roomId}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography color="text.secondary">
                Last updated date:{' '}
                {format(
                  new Date(examRoom.lastModifiedDate),
                  'dd/MM/yyyy HH:mm',
                )}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box color="text.secondary">
                Status:
                <Typography display="inline" ml={0.5} color={statusColor}>
                  {statusText}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Stack
              spacing={2}
              direction="row"
              sx={{
                display: notAllowedEditExamRoomStatuses.has(shift.status)
                  ? 'none'
                  : 'inherit',
              }}
            >
              <Button
                disabled={!isEditable}
                type="submit"
                variant="contained"
                sx={{ minWidth: 120 }}
              >
                Update
              </Button>
              <Button
                disabled={!isEditable}
                variant="contained"
                color="error"
                onClick={() => handleDelete(String(examRoom.examRoomId))}
                sx={{ minWidth: 120 }}
              >
                Delete
              </Button>
            </Stack>
          )}
        </CardActions>
      </Box>
    </Card>
  );
};

export default ExamRoomDetailCard;
