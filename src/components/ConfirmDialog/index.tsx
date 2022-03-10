import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React from 'react';

export interface ConfirmDialogProps {
  loading?: boolean;
  title: string;
  content?: string;
  open: boolean;
  handleClose: () => void;
  handleAccept: () => void;
}

const ConfirmDialog = ({
  title,
  content,
  open,
  loading = false,
  handleClose,
  handleAccept,
}: ConfirmDialogProps) => (
  <div>
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>{loading ? 'Processing...' : title}</DialogTitle>
      {content && (
        <DialogContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={150}
            >
              <CircularProgress />
            </Box>
          ) : (
            <DialogContentText>{content}</DialogContentText>
          )}
        </DialogContent>
      )}
      {!loading && (
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAccept} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      )}
    </Dialog>
  </div>
);

export default ConfirmDialog;
