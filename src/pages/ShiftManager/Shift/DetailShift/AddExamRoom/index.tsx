import { Alert, Button, Grid, Stack, Typography } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddRoomDialog from 'components/AddRoomDialog';
import AvailableRoomTable from 'components/AvailableRoomTable';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import ExamineeTable from 'components/ExamineeTable';
import ExamineeTransferListDialog from 'components/ExamineeTransferListDialog';
import GetAvailableExamRoomsCard from 'components/GetAvailableExamRoomsCard';
import LoadingIndicator from 'components/LoadingIndicator';
import Attendance from 'dtos/attendance.dto';
import CreateExamRoomDto from 'dtos/createExamRoom.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import {
  createExamRoom,
  getAssignedExamRooms,
  updateDropdown,
  updateExamRoom,
  updateTotalExaminees,
} from 'features/examRoom/addExamRoomSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

const AddExamRoomPage = () => {
  const { id } = useParams<ParamProps>();
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isLoading, examRooms, currentSubject } = useAppSelector(
    state => state.addExamRoom,
  );

  const handleError = () => {
    dispatch(updateExamRoom(null));
    setSelectedIndex(-1);
  };

  const handleGetAvailableRooms = async (payload: GetAvailableExamineesDto) => {
    const result = await dispatch(getAssignedExamRooms(payload));
    unwrapResult(result);
    setSelectedIndex(-1);
  };

  const handleChangeRoom = (value: number) => {
    setSelectedIndex(value);
  };

  const handleCreateExamRoom = async () => {
    if (examRooms && currentSubject) {
      const examRoom = examRooms.examRooms[selectedIndex];
      const lastPosition = examRoom.room.lastPosition
        ? parseInt(String(examRoom.room.lastPosition), 10)
        : 0;
      const attendances: Attendance[] = examRoom.attendances.map(
        (attendance, index) => ({
          position: lastPosition + index + 1,
          subjectExaminee: {
            subjectExamineeId: attendance.subjectExaminee.subjectExamineeId,
          },
        }),
      );
      const payload: CreateExamRoomDto = {
        room: {
          roomId: examRoom.room.roomId,
        },
        shift: {
          shiftId: id,
        },
        subjectSemester: {
          subjectSemesterId: currentSubject.subjectSemesterId,
        },
        attendances,
      };
      try {
        const result = await dispatch(createExamRoom([payload]));
        const examRoomResult = unwrapResult(result);
        dispatch(
          updateTotalExaminees(
            examRooms.totalExaminees -
              examRoomResult.result[0].attendances.length,
          ),
        );
        dispatch(updateDropdown(true));
        setSelectedIndex(-1);
        showSuccessMessage('Created exam room successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  const handleCreateAllExamRoom = async () => {
    if (examRooms && currentSubject) {
      const examRoomList = examRooms.examRooms;
      const payload: CreateExamRoomDto[] = [];
      examRoomList.forEach(examRoom => {
        const lastPosition = examRoom.room.lastPosition
          ? parseInt(String(examRoom.room.lastPosition), 10)
          : 0;
        const attendances: Attendance[] = examRoom.attendances.map(
          // eslint-disable-next-line sonarjs/no-identical-functions
          (attendance, index) => ({
            position: lastPosition + index + 1,
            subjectExaminee: {
              subjectExamineeId: attendance.subjectExaminee.subjectExamineeId,
            },
          }),
        );
        if (attendances.length > 0) {
          const dto: CreateExamRoomDto = {
            room: {
              roomId: examRoom.room.roomId,
            },
            shift: {
              shiftId: id,
            },
            subjectSemester: {
              subjectSemesterId: currentSubject.subjectSemesterId,
            },
            attendances,
          };
          payload.push(dto);
        }
      });
      try {
        const result = await dispatch(createExamRoom(payload));
        const examRoomResult = unwrapResult(result);
        let addedAttendances = 0;
        examRoomResult.result.forEach(examRoom => {
          addedAttendances += examRoom.attendances.length;
        });
        dispatch(
          updateTotalExaminees(examRooms.totalExaminees - addedAttendances),
        );
        dispatch(updateDropdown(true));
        setSelectedIndex(-1);
        showSuccessMessage(
          `Created ${examRoomResult.result.length} exam room(s) successfully`,
        );
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  useEffect(() => {
    dispatch(updateExamRoom(null));
  }, []);

  return (
    <div>
      <BackToPreviousPageButton
        title="Back to detail shift page"
        route={`/shift-manager/shifts/${id}`}
      />
      <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <GetAvailableExamRoomsCard
              shiftId={id}
              handleSubmit={handleGetAvailableRooms}
              handleError={handleError}
            />
            {!isLoading ? (
              examRooms &&
              examRooms.examRooms.length > 0 && (
                <>
                  <AddRoomDialog
                    shiftId={id}
                    open={isOpenAddRoom}
                    handleClose={() => setIsOpenAddRoom(false)}
                  />
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ marginRight: 1 }}
                      >
                        Room list
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={handleCreateAllExamRoom}
                        size="small"
                      >
                        Create all
                      </Button>
                    </Stack>
                    {examRooms.totalExaminees > 0 && (
                      <Alert severity="error">
                        {`There are ${examRooms.totalExaminees} examinees left unassigned`}
                      </Alert>
                    )}
                  </Stack>
                  <Stack spacing={2}>
                    <AvailableRoomTable
                      data={examRooms.examRooms}
                      selectedIndex={selectedIndex}
                      handleSelect={handleChangeRoom}
                      handleCreateExamRoom={handleCreateExamRoom}
                    />
                    <Button
                      variant="text"
                      sx={{ width: 100 }}
                      disableRipple
                      disableTouchRipple
                      disableFocusRipple
                      onClick={() => setIsOpenAddRoom(true)}
                    >
                      Add room
                    </Button>
                  </Stack>
                </>
              )
            ) : (
              <LoadingIndicator />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} lg={8}>
          {!isLoading &&
            selectedIndex > -1 &&
            examRooms &&
            examRooms.examRooms[selectedIndex] && (
              <>
                <ExamineeTransferListDialog
                  handleClose={() => setIsOpen(false)}
                  room={examRooms.examRooms[selectedIndex].room}
                  selectedIndex={selectedIndex}
                  open={isOpen}
                />
                <ExamineeTable
                  room={examRooms.examRooms[selectedIndex].room}
                  data={examRooms.examRooms[selectedIndex].attendances}
                  onActionButtonClick={() => setIsOpen(true)}
                />
              </>
            )}
        </Grid>
      </Grid>
    </div>
  );
};

export default AddExamRoomPage;
