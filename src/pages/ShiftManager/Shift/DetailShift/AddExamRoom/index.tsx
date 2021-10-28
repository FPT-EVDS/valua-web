import { ChevronLeft, Info } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { useAppSelector } from 'app/hooks';
import AvailableRoomTable from 'components/AvailableRoomTable';
import ExamineeTable from 'components/ExamineeTable';
import GetAvailableExamRoomsCard from 'components/GetAvailableExamRoomsCard';
import LoadingIndicator from 'components/LoadingIndicator';
import AvailableExamineesDto from 'dtos/availableExaminees.dto';
import AvailableRoomsDto from 'dtos/availableRooms.dto';
import GetAvailableExamineesDto from 'dtos/getAvailableExaminees.dto';
import GetAvailableExamRoomsDto from 'dtos/getAvailableRooms.dto';
import Examinee from 'models/examinee.model';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import examRoomServices from 'services/examRoom.service';
import { chunk } from 'utils';

interface ParamProps {
  id: string;
}

const AddExamRoomPage = () => {
  const { id } = useParams<ParamProps>();
  const themes = useTheme();
  const [examRooms, setExamRooms] = useState<AvailableRoomsDto | null>(null);
  const [examinees, setExaminees] = useState<AvailableExamineesDto | null>(
    null,
  );
  const [listExamineesByRoom, setListExamineesByRoom] = useState<
    Examinee[][] | null
  >(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isLoading } = useAppSelector(state => state.addExamRoom);

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

  useEffect(() => {
    console.log(selectedIndex);
  }, [selectedIndex]);

  return (
    <div>
      <Box
        width={220}
        display="flex"
        alignItems="center"
        sx={{ cursor: 'pointer' }}
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
            />
            {!isLoading ? (
              examRooms && (
                <>
                  <Stack direction="row" alignItems="center">
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{ marginRight: 1 }}
                    >
                      Room list
                    </Typography>
                    {examinees && (
                      <Tooltip
                        title={`There are ${examinees.totalExaminees} examinees left unassigned`}
                        placement="right"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#fff',
                              boxShadow: themes.shadows[4],
                              color: red[500],
                              fontSize: 13,
                            },
                          },
                          arrow: {
                            sx: {
                              color: '#fff',
                            },
                          },
                        }}
                      >
                        <Info color="error" />
                      </Tooltip>
                    )}
                  </Stack>
                  <AvailableRoomTable
                    data={examRooms?.availableRooms}
                    selectedIndex={selectedIndex}
                    handleSelect={value => setSelectedIndex(value)}
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
            <Typography variant="h6" component="div" sx={{ marginRight: 1 }}>
              {selectedIndex > -1 &&
                examRooms &&
                examRooms?.availableRooms[selectedIndex].roomName}
            </Typography>
            {selectedIndex > -1 && listExamineesByRoom && (
              <ExamineeTable data={listExamineesByRoom[selectedIndex]} />
            )}
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddExamRoomPage;
