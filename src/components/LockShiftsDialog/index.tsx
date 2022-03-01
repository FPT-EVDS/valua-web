import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { ReactComponent as NoData } from 'assets/images/no-data.svg';
import LoadingIndicator from 'components/LoadingIndicator';
import SlideTransition from 'components/SlideTransition';
import { format } from 'date-fns';
import { lockShifts } from 'features/shift/shiftSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Shift from 'models/shift.model';
import React, { useEffect, useState } from 'react';
import shiftServices from 'services/shift.service';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const LockShiftsDialog: React.FC<Props> = ({ open, handleClose }) => {
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const dateFormat = 'dd/MM/yyyy HH:mm';
  const [shifts, setShifts] =
    useState<
      Array<Pick<Shift, 'status' | 'shiftId' | 'beginTime' | 'finishTime'>>
    >();
  const [checked, setChecked] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const fetchShiftsForLocking = () => {
    shiftServices
      .getShiftsToLock()
      .then(response => setShifts(response.data.readyShifts))
      .catch(error => showErrorMessage(error))
      .finally(() => setIsLoading(false))
      .catch(error => showErrorMessage(error));
  };

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      fetchShiftsForLocking();
    }
  }, [open]);

  const handleSubmit = async () => {
    try {
      const payload = checked.map(shiftId => ({
        shiftId,
      }));
      setIsLoading(true);
      const result = await dispatch(lockShifts(payload));
      unwrapResult(result);
      showSuccessMessage(`Lock ${checked.length} shift(s) sucessfully`);
      setChecked([]);
      fetchShiftsForLocking();
      handleClose();
    } catch (error) {
      showErrorMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
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
          <Typography variant="h6">Select shifts to lock</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        {isLoading ? (
          <LoadingIndicator />
        ) : shifts && shifts.length > 0 ? (
          <List>
            {shifts.map(shift => {
              const labelId = String(shift.shiftId);
              return (
                <ListItem key={labelId}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      onChange={handleToggle(labelId)}
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`${format(
                      new Date(shift.beginTime),
                      dateFormat,
                    )} - ${format(new Date(shift.finishTime), dateFormat)}`}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <NoData height={200} width={150} />
            <Typography fontSize={16} color={grey[600]} marginTop={1}>
              No shifts available for locking
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            width: 150,
            margin: 2,
            display: isLoading ? 'none' : 'inherit',
          }}
          onClick={handleSubmit}
          disabled={checked.length === 0}
        >
          Lock shifts
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LockShiftsDialog;
