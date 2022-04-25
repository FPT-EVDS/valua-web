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
import SlideTransition from 'components/SlideTransition';
import StaffDropdown from 'components/StaffDropdown';
import AssignStaffToExamRoomDto from 'dtos/assignStaffToExamRoom.dto';
import { assignStaff } from 'features/examRoom/examRoomSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Account from 'models/account.model';
import React, { useEffect, useState } from 'react';

interface Props {
  shiftId: string;
  examRoomId: string;
  open: boolean;
  handleClose: () => void;
}

const AssignStaffDialog: React.FC<Props> = ({
  shiftId,
  examRoomId,
  open,
  handleClose,
}) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const {
    current: { examRooms },
  } = useAppSelector(state => state.examRoom);
  const dispatch = useAppDispatch();
  const examRoom = examRooms.find(item => item.examRoomId === examRoomId);
  const [currentStaff, setCurrentStaff] = useState<Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  > | null>(null);

  const formik = useFormik({
    initialValues: {
      examRoomId: examRoom?.examRoomId || '',
      staffId: '',
    },
    onSubmit: async (payload: AssignStaffToExamRoomDto) => {
      try {
        const result = await dispatch(assignStaff(payload));
        unwrapResult(result);
        showSuccessMessage('Assign staff successfully');
        formik.resetForm();
        setCurrentStaff(null);
        handleClose();
      } catch (error) {
        showErrorMessage(error);
      }
    },
  });

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
    setCurrentStaff(staff);
    await formik.setFieldValue('staffId', staff?.appUserId);
  };

  const updateExamRoomId = async () => {
    await formik.setFieldValue('examRoomId', examRoomId);
  };

  useEffect(() => {
    updateExamRoomId().catch(error => showErrorMessage(error));
  }, [examRoomId]);

  return (
    <Dialog open={open} fullWidth TransitionComponent={SlideTransition}>
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">
            Assign staff to {examRoom?.examRoomName}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box component="form" pb={2} onSubmit={formik.handleSubmit} noValidate>
        <DialogContent>
          <StaffDropdown
            isEditable
            onChange={handleChangeStaff}
            shiftId={shiftId}
            value={currentStaff}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            type="submit"
            variant="contained"
            sx={{ width: 150 }}
            disabled={currentStaff === null}
          >
            Assign
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AssignStaffDialog;
