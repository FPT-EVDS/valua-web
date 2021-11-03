import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ExamineeDropdown from 'components/ExamineeDropdown';
import SlideTransition from 'components/SlideTransition';
import DetailExamSeat from 'dtos/detailExamSeat.dto';
import { addExamSeat } from 'features/examRoom/detailExamRoomSlice';
import { useFormik } from 'formik';
import Examinee from 'models/examinee.model';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const AddExamineeSeatDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { examRoom } = useAppSelector(state => state.detailExamRoom);
  const dispatch = useAppDispatch();
  const [currentExaminee, setCurrentExaminee] = useState<Examinee | null>(null);

  const formik = useFormik({
    initialValues: {
      examRoom: {
        examRoomID: String(examRoom?.examRoomID),
      },
      examinee: {
        appUserId: '',
      },
    },
    onSubmit: async (payload: DetailExamSeat) => {
      try {
        const result = await dispatch(addExamSeat(payload));
        unwrapResult(result);
        enqueueSnackbar('Add new seat success', {
          variant: 'success',
          preventDuplicate: true,
        });
        formik.resetForm();
        handleClose();
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const handleChangeExaminee = async (examinee: Examinee | null) => {
    setCurrentExaminee(examinee);
    await formik.setFieldValue(
      'examinee.appUserId',
      examinee?.examinee.appUserId,
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      TransitionComponent={SlideTransition}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">Add examinee</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" pb={2} onSubmit={formik.handleSubmit}>
        <DialogContent>
          {examRoom && (
            <ExamineeDropdown
              isEditable
              value={currentExaminee}
              onChange={handleChangeExaminee}
              shiftId={String(examRoom.shift.shiftId)}
              subjectId={examRoom.subject.subjectId}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            disabled={currentExaminee === null}
          >
            Assign
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddExamineeSeatDialog;
