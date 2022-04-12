import { Close } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import ExamineeTransferList from 'components/ExamineeTransferList';
import SlideTransition from 'components/SlideTransition';
import {
  addRemovedExaminees,
  updateRoomExaminees,
} from 'features/examRoom/addExamRoomSlice';
import Room from 'models/room.model';
import SubjectExaminee from 'models/subjectExaminee.model';
import React, { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  selectedIndex: number;
  room: Room;
}

const ExamineeTransferListDialog: React.FC<Props> = ({
  open,
  handleClose,
  selectedIndex,
  room,
}) => {
  const [selected, setSelected] = useState<SubjectExaminee[] | null>(null);
  const [unselected, setUnselected] = useState<SubjectExaminee[] | null>(null);
  const dispatch = useAppDispatch();

  const handleSelected = (examinee: SubjectExaminee[]) => {
    setSelected(examinee);
  };

  const handleUnselected = (examinee: SubjectExaminee[]) => {
    setUnselected(examinee);
  };

  const handleSubmit = () => {
    if (unselected) {
      dispatch(addRemovedExaminees({ examinees: unselected }));
    }
    if (selected) {
      dispatch(
        updateRoomExaminees({ examinees: selected, roomId: room.roomId }),
      );
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
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
          <Typography variant="h6">Add examinee to {room.roomName}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <ExamineeTransferList
          roomName={room.roomName}
          selectedIndex={selectedIndex}
          handleSelected={handleSelected}
          handleUnselected={handleUnselected}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button variant="contained" sx={{ width: 150 }} onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExamineeTransferListDialog;
