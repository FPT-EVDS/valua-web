import { Info } from '@mui/icons-material';
import {
  Alert,
  Button,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AvailableRoomTable from 'components/AvailableRoomTable';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import CustomTooltip from 'components/CustomTooltip';
import ExamineeTable from 'components/ExamineeTable';
import ExamineeTransferListDialog from 'components/ExamineeTransferListDialog';
import GetAvailableExamRoomsCard from 'components/GetAvailableExamRoomsCard';
import LoadingIndicator from 'components/LoadingIndicator';
import Attendance from 'dtos/attendance.dto';
import AvailableRoomsDto from 'dtos/availableRooms.dto';
import CreateExamRoomDto from 'dtos/createExamRoom.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import {
  createExamRoom,
  updateExaminees,
} from 'features/examRoom/addExamRoomSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Examinee from 'models/examinee.model';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import examRoomServices from 'services/examRoom.service';
import { chunk } from 'utils';

interface ParamProps {
  id: string;
}

const AddExamRoomPage = () => {
  const { id } = useParams<ParamProps>();
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [examRooms, setExamRooms] = useState<AvailableRoomsDto | null>(null);
  const [listExamineesByRoom, setListExamineesByRoom] = useState<
    Examinee[][] | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const {
    isLoading,
    defaultExamRoomSize,
    currentSubject,
    shift,
    removedExaminees,
    examinees,
  } = useAppSelector(state => state.addExamRoom);

  const handleError = () => {
    setExamRooms(null);
    setSelectedIndex(-1);
    setListExamineesByRoom(null);
  };

  const handleGetAvailableRooms = async (payload: GetAvailableExamRoomsDto) => {
    const response = await examRoomServices.getAvailableExamRooms(payload);
    setExamRooms(response.data);
    setSelectedIndex(-1);
    const { totalRooms } = response.data;
    if (examinees) {
      const examineePerRoom = Math.ceil(examinees.totalExaminees / totalRooms);
      setListExamineesByRoom(chunk(examinees.examinees, examineePerRoom));
    }
  };

  const handleChangeRoom = (value: number) => {
    setSelectedIndex(value);
    if (examinees && examRooms) {
      const examineePerRoom = Math.ceil(
        examinees.totalExaminees / examRooms.totalRooms,
      );
      setListExamineesByRoom(chunk(examinees.examinees, examineePerRoom));
    }
  };

  const handleCreateExamRoom = async () => {
    if (listExamineesByRoom && examRooms && currentSubject && shift) {
      const filteredRemovedExamineesList = listExamineesByRoom[
        selectedIndex
      ].filter(value => !removedExaminees.includes(value));
      const appUserIdList = new Set(
        filteredRemovedExamineesList.map(value => value.examinee.appUserId),
      );
      const attendances: Attendance[] = filteredRemovedExamineesList.map(
        (value, index) => ({
          examinee: {
            appUserId: value.examinee.appUserId,
          },
          position: index + 1,
        }),
      );
      const payload: CreateExamRoomDto = {
        attendances,
        shift: {
          shiftId: id,
        },
        room: {
          roomId: examRooms.availableRooms[selectedIndex].roomId,
        },
        subject: {
          subjectId: currentSubject?.subjectId,
        },
      };
      try {
        const result = await dispatch(createExamRoom([payload]));
        unwrapResult(result);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const filteredExaminees = examinees!.examinees.filter(
          examinee => !appUserIdList.has(examinee.examinee.appUserId),
        );
        const filteredExamRooms =
          filteredExaminees.length > 0
            ? examRooms.availableRooms.filter(
                (examRoom, index) => index !== selectedIndex,
              )
            : [];
        dispatch(
          updateExaminees({
            examinees: filteredExaminees,
            totalExaminees: filteredExaminees?.length || 0,
          }),
        );
        setExamRooms({
          availableRooms: filteredExamRooms,
          totalRooms: filteredExamRooms.length,
        });
        setSelectedIndex(-1);
        showSuccessMessage('Created exam room successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  const handleCreateAllExamRoom = async () => {
    if (examinees && examRooms && currentSubject) {
      const examineePerRoom = Math.ceil(
        examinees.totalExaminees / examRooms.totalRooms,
      );
      const listExamineesPerRoom = chunk(examinees.examinees, examineePerRoom);
      const payload: CreateExamRoomDto[] = listExamineesPerRoom.map(
        (value, index) => {
          const attendances: Attendance[] = value.map(
            (examinee, examineeIndex) => ({
              examinee: {
                appUserId: examinee.examinee.appUserId,
              },
              position: examineeIndex + 1,
            }),
          );
          return {
            attendances,
            shift: {
              shiftId: id,
            },
            room: {
              roomId: examRooms.availableRooms[index].roomId,
            },
            subject: {
              subjectId: currentSubject?.subjectId,
            },
          };
        },
      );
      try {
        const result = await dispatch(createExamRoom(payload));
        unwrapResult(result);
        dispatch(
          updateExaminees({
            examinees: [],
            totalExaminees: 0,
          }),
        );
        setExamRooms({
          availableRooms: [],
          totalRooms: 0,
        });
        setSelectedIndex(-1);
        showSuccessMessage('Created exam room successfully');
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

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
              examRooms.availableRooms.length > 0 && (
                <>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ marginRight: 1 }}
                      >
                        Room list
                      </Typography>
                      <Tooltip title="Auto assign examinees to room">
                        <Button
                          variant="contained"
                          onClick={handleCreateAllExamRoom}
                          size="small"
                        >
                          Create all
                        </Button>
                      </Tooltip>
                    </Stack>
                    {examinees && examinees.totalExaminees > 0 && (
                      <Alert severity="error">
                        {`There are ${examinees.totalExaminees} examinees left unassigned`}
                      </Alert>
                    )}
                  </Stack>
                  <AvailableRoomTable
                    data={examRooms?.availableRooms}
                    selectedIndex={selectedIndex}
                    handleSelect={handleChangeRoom}
                    handleCreateExamRoom={handleCreateExamRoom}
                  />
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
            examRooms?.availableRooms[selectedIndex] &&
            listExamineesByRoom && (
              <>
                <ExamineeTransferListDialog
                  handleClose={() => setIsOpen(false)}
                  listExamineeByRoom={listExamineesByRoom}
                  roomName={examRooms.availableRooms[selectedIndex].roomName}
                  handleListExamineeByRoom={setListExamineesByRoom}
                  selectedIndex={selectedIndex}
                  open={isOpen}
                />
                <ExamineeTable
                  title={examRooms.availableRooms[selectedIndex].roomName}
                  data={listExamineesByRoom[selectedIndex]}
                  leftActions={
                    listExamineesByRoom[selectedIndex].length !==
                      defaultExamRoomSize && (
                      <CustomTooltip
                        title={`Recommend room size is ${defaultExamRoomSize}`}
                        color={theme.palette.warning.main}
                      >
                        <Info color="warning" />
                      </CustomTooltip>
                    )
                  }
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
