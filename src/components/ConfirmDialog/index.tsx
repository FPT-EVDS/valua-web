import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

export interface ConfirmDialogProps {
  title: string;
  content: string;
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
}

const ConfirmDialog = ({
  title,
  content,
  open,
  handleClose,
  handleAccept,
}: ConfirmDialogProps) => (
  <div>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAccept} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

export default ConfirmDialog;
