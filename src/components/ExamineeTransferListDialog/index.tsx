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
import ExamineeTransferList from 'components/ExamineeTransferList';
import SlideTransition from 'components/SlideTransition';
import Examinee from 'models/examinee.model';
import React, { useState } from 'react';

interface Props {
  open: boolean;
  handleClose: () => void;
  listExamineeByRoom: Examinee[][];
  selectedIndex: number;
  roomName: string;
  handleListExamineeByRoom: React.Dispatch<
    React.SetStateAction<Examinee[][] | null>
  >;
}

const ExamineeTransferListDialog: React.FC<Props> = ({
  open,
  handleClose,
  listExamineeByRoom,
  selectedIndex,
  roomName,
  handleListExamineeByRoom,
}) => {
  const [selected, setSelected] = useState<Examinee[] | null>(null);

  const handleSelected = (examinee: Examinee[]) => {
    setSelected(examinee);
  };

  const handleSubmit = () => {
    handleListExamineeByRoom(prev => {
      const prevState = prev;
      if (prevState && selected) {
        prevState[selectedIndex] = selected;
      }
      return prevState;
    });
    handleClose();
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
          <Typography variant="h6">Add examinee to {roomName}</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <ExamineeTransferList
          roomName={roomName}
          listExamineeByRoom={listExamineeByRoom}
          selectedIndex={selectedIndex}
          handleSelected={handleSelected}
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
