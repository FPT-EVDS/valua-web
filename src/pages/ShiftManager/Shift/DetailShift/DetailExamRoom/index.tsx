import { Add, ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddExamineeSeatDialog from 'components/AddExamineeSeatDialog';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import ExamRoomDetailCard from 'components/ExamRoomDetailCard';
import ExamSeatTable from 'components/ExamSeatTable';
import { format } from 'date-fns';
import {
  deleteExamRoom,
  getDetailExamRoom,
  getShift,
} from 'features/examRoom/detailExamRoomSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
  examRoomId: string;
}

const DetailExamRoomPage = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { examRoom, shift, isLoading } = useAppSelector(
    state => state.detailExamRoom,
  );
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this exam room ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { id, examRoomId } = useParams<ParamProps>();

  const fetchDetailExamRoom = async () => {
    const result = await dispatch(getDetailExamRoom(examRoomId));
    return unwrapResult(result);
  };

  const fetchDetailShift = async (shiftId: string) => {
    const result = await dispatch(getShift(shiftId));
    unwrapResult(result);
  };

  const showErrorMessage = (error: string) =>
    enqueueSnackbar(error, {
      variant: 'error',
      preventDuplicate: true,
    });

  useEffect(() => {
    fetchDetailExamRoom()
      .then(result => fetchDetailShift(String(result.shift.shiftId)))
      .catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteExamRoom = async (roomId: string) => {
    try {
      const result = await dispatch(deleteExamRoom(roomId));
      unwrapResult(result);
      enqueueSnackbar('Exam room has been successfully deleted', {
        variant: 'success',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
      history.push(`/shift-manager/shift/${id}`);
    } catch (error) {
      showErrorMessage(error);
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const showDeleteConfirmation = (roomId: string) => {
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      handleAccept: () => handleDeleteExamRoom(roomId),
    }));
  };

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <Box
        width={250}
        display="flex"
        alignItems="center"
        justifyContent="start"
        onClick={() => history.push(`/shift-manager/shift/${id}`)}
        sx={{ cursor: 'pointer' }}
      >
        <ChevronLeft />
        <div>Back to detail shift page</div>
      </Box>
      <Grid container mt={2} columnSpacing={6} rowSpacing={2}>
        {examRoom && shift && (
          <>
            <AddExamineeSeatDialog
              examRoomId={examRoomId}
              handleClose={() => setOpen(false)}
              open={open}
            />
            <Grid item xs={12} md={12} lg={4}>
              <Stack spacing={3}>
                <Card sx={{ minWidth: 275 }} elevation={2}>
                  <CardHeader
                    title={
                      <Typography
                        sx={{ fontWeight: 'medium', fontSize: 20 }}
                        variant="h5"
                        gutterBottom
                      >
                        Shift information
                      </Typography>
                    }
                  />
                  <Box>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                          <TextField
                            label="Start time"
                            autoFocus
                            margin="dense"
                            fullWidth
                            disabled
                            value={format(
                              new Date(examRoom.shift.beginTime),
                              'dd/MM/yyyy HH:mm',
                            )}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <TextField
                            label="Finish time"
                            autoFocus
                            margin="dense"
                            fullWidth
                            disabled
                            value={format(
                              new Date(examRoom.shift.finishTime),
                              'dd/MM/yyyy HH:mm',
                            )}
                            variant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Box>
                </Card>
                <ExamRoomDetailCard
                  examRoom={examRoom}
                  shift={shift}
                  isLoading={isLoading}
                  handleDelete={showDeleteConfirmation}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} lg={8}>
              <Stack spacing={3}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
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
                      Exam seat list
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                  >
                    Add examinee
                  </Button>
                </Stack>
                <ExamSeatTable data={examRoom.examSeats} />
              </Stack>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default DetailExamRoomPage;
