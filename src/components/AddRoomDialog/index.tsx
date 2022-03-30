import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import AddRoomDropdown from 'components/AddRoomDropdown';
import SlideTransition from 'components/SlideTransition';
import { addExamRooms } from 'features/examRoom/addExamRoomSlice';
import Room from 'models/room.model';
import React, { useState } from 'react';

interface Props {
  shiftId: string;
  open: boolean;
  handleClose: () => void;
}

const AddRoomDialog: React.FC<Props> = ({ shiftId, open, handleClose }) => {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector(state => state.addExamRoom);

  const handleSubmit = () => {
    if (rooms) {
      dispatch(addExamRooms(rooms));
      setRooms(null);
      handleClose();
    }
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
          Add room to room list
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <AddRoomDropdown
          isEditable
          shiftId={shiftId}
          value={rooms}
          onChange={selectedRooms => setRooms(selectedRooms)}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <LoadingButton
          variant="contained"
          sx={{ width: 150 }}
          loading={isLoading}
          onClick={handleSubmit}
        >
          Add
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddRoomDialog;
