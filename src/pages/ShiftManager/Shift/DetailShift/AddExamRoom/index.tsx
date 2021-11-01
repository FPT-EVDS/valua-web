import { Add, ChevronLeft, Info } from '@mui/icons-material';
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import { red } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AvailableRoomTable from 'components/AvailableRoomTable';
import CustomTooltip from 'components/CustomTooltip';
import ExamineeTable from 'components/ExamineeTable';
import ExamineeTransferListDialog from 'components/ExamineeTransferListDialog';
import GetAvailableExamRoomsCard from 'components/GetAvailableExamRoomsCard';
import LoadingIndicator from 'components/LoadingIndicator';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import AvailableRoomsDto from 'dtos/availableRooms.dto';
import CreateExamRoomDto from 'dtos/createExamRoom.dto';
import ExamineeSeat from 'dtos/examineeSeat.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import {
  createExamRoom,
  updateRemovedExaminees,
} from 'features/examRoom/addExamRoomSlice';
import Examinee from 'models/examinee.model';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import examRoomServices from 'services/examRoom.service';
import { chunk } from 'utils';

interface ParamProps {
  id: string;
}

const AddExamRoomPage = () => {
  const { id } = useParams<ParamProps>();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [examRooms, setExamRooms] = useState<AvailableRoomsDto | null>(null);
  const [examinees, setExaminees] = useState<AvailableExamineesDto | null>(
    null,
  );
  const [listExamineesByRoom, setListExamineesByRoom] = useState<
    Examinee[][] | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isLoading, defaultExamRoomSize, currentSubject, shift } =
    useAppSelector(state => state.addExamRoom);

  const showErrorMessage = (error: string) =>
    enqueueSnackbar(error, {
      variant: 'error',
      preventDuplicate: true,
    });

  const handleError = () => {
    setExamRooms(null);
    setExaminees(null);
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

  const handleGetAvailableExaminees = async (
    payload: GetAvailableExamineesDto,
  ) => {
    const response = await examRoomServices.getAvailableExaminees(payload);
    setExaminees(response.data);
  };

  const handleChangeRoom = (value: number) => {
    setSelectedIndex(value);
    if (examinees && examRooms) {
      const examineePerRoom = Math.ceil(
        examinees.totalExaminees / examRooms.totalRooms,
      );
      dispatch(updateRemovedExaminees([]));
      setListExamineesByRoom(chunk(examinees.examinees, examineePerRoom));
    }
  };

  const handleCreateExamRoom = async () => {
    if (listExamineesByRoom && examRooms && currentSubject && shift) {
      console.log(
        '🚀 ~ file: index.tsx ~ line 95 ~ handleCreateExamRoom ~ listExamineesByRoom',
        listExamineesByRoom,
      );
      const appUserIdList = new Set(
        listExamineesByRoom[selectedIndex].map(
          (value, index) => value.examinee.appUserId,
        ),
      );
      const examSeats: ExamineeSeat[] = listExamineesByRoom[selectedIndex].map(
        (value, index) => ({
          examinee: {
            appUserId: value.examinee.appUserId,
          },
          position: index + 1,
        }),
      );
      const payload: CreateExamRoomDto = {
        examSeats,
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
        const result = await dispatch(createExamRoom(payload));
        unwrapResult(result);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const filteredExaminees = examinees!.examinees.filter(
          examinee => !appUserIdList.has(examinee.examinee.appUserId),
        );
        const filteredExamRooms = examRooms.availableRooms.filter(
          (examRoom, index) => index !== selectedIndex,
        );
        setExamRooms({
          availableRooms: filteredExamRooms,
          totalRooms: filteredExamRooms.length,
        });
        setExaminees({
          examinees: filteredExaminees,
          totalExaminees: filteredExaminees?.length || 0,
        });
        setSelectedIndex(-1);
        enqueueSnackbar('Create exam room success', {
          variant: 'success',
          preventDuplicate: true,
        });
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  return (
    <div>
      <Box
        width={220}
        display="flex"
        alignItems="center"
        sx={{ cursor: 'pointer' }}
        onClick={() => history.push(`/shift-manager/shift/${id}`)}
      >
        <ChevronLeft />
        <div>Back to detail shift page</div>
      </Box>
      <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <GetAvailableExamRoomsCard
              shiftId={id}
              examinees={examinees}
              handleSubmit={handleGetAvailableRooms}
              handleGetAvailableExaminees={handleGetAvailableExaminees}
              handleError={handleError}
            />
            {!isLoading ? (
              examRooms &&
              examRooms.availableRooms.length > 0 && (
                <>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ marginRight: 1 }}
                    >
                      Room list
                    </Typography>
                    {examinees && examinees.totalExaminees > 0 && (
                      <CustomTooltip
                        title={`There are ${examinees.totalExaminees} examinees left unassigned`}
                        color={red[500]}
                      >
                        <Info color="error" />
                      </CustomTooltip>
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
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {!isLoading &&
                examRooms?.availableRooms[selectedIndex] &&
                selectedIndex > -1 &&
                listExamineesByRoom && (
                  <>
                    <ExamineeTransferListDialog
                      handleClose={() => setIsOpen(false)}
                      listExamineeByRoom={listExamineesByRoom}
                      roomName={
                        examRooms.availableRooms[selectedIndex].roomName
                      }
                      handleListExamineeByRoom={setListExamineesByRoom}
                      selectedIndex={selectedIndex}
                      open={isOpen}
                    />
                    <Box
                      display="flex"
                      justifyContent="flex-start"
                      alignItems="center"
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ marginRight: 1 }}
                      >
                        {examRooms.availableRooms[selectedIndex].roomName}
                      </Typography>
                      {listExamineesByRoom[selectedIndex].length !==
                        defaultExamRoomSize && (
                        <CustomTooltip
                          title={`Recommend room size is ${defaultExamRoomSize}`}
                          color={theme.palette.warning.main}
                        >
                          <Info color="warning" />
                        </CustomTooltip>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => setIsOpen(true)}
                    >
                      Add examinee
                    </Button>
                  </>
                )}
            </Stack>
            {!isLoading && selectedIndex > -1 && listExamineesByRoom && (
              <ExamineeTable data={listExamineesByRoom[selectedIndex]} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddExamRoomPage;
