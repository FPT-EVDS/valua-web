import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import { removeExamineeSchema } from 'configs/validations';
import RemoveExamineeDto from 'dtos/removeExaminee.dto';
import { removeExaminee } from 'features/subjectExaminee/detailExamineeSubjectSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';

interface RemoveExamineeDialogProps {
  subjectExamineeId: string | null;
  title: string | null;
  open: boolean;
  handleClose: () => void;
  // eslint-disable-next-line react/require-default-props
  initialValue?: string | null;
}

const RemoveExamineeDialog = ({
  subjectExamineeId,
  open,
  handleClose,
  title,
  initialValue,
}: RemoveExamineeDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hideActions, setHideActions] = useState(false);
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const dispatch = useAppDispatch();
  const formik = useFormik({
    initialValues: {
      removedReason: initialValue ?? '',
      subjectExamineeId: subjectExamineeId || '',
    },
    validationSchema: removeExamineeSchema,
    onSubmit: async (payload: RemoveExamineeDto) => {
      setIsLoading(true);
      if (subjectExamineeId) {
        try {
          const result = await dispatch(removeExaminee(payload));
          unwrapResult(result);
          showSuccessMessage('Remove examinee success');
        } catch (error) {
          showErrorMessage('Can not remove this examinee');
        } finally {
          setIsLoading(false);
          formik.resetForm();
          handleClose();
        }
      }
    },
  });

  const handleCloseModal = () => {
    formik.resetForm();
    handleClose();
  };

  const refreshSubjectExamineeId = async () => {
    await formik.setFieldValue('subjectExamineeId', subjectExamineeId);
    if (initialValue && initialValue.length > 0) {
      await formik.setFieldValue('removedReason', initialValue);
      setHideActions(true);
    } else {
      await formik.setFieldValue('removedReason', '');
      setHideActions(false);
    }
  };

  useEffect(() => {
    refreshSubjectExamineeId().catch(error => showErrorMessage(error));
  }, [subjectExamineeId, initialValue]);

  return (
    <div>
      <Dialog open={open} onClose={handleCloseModal} fullWidth>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            {title || 'Confirm remove'}
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              name="removedReason"
              disabled={hideActions}
              value={formik.values.removedReason}
              multiline
              rows={4}
              margin="dense"
              placeholder="Specify the remove reason here"
              helperText="Reason must be 8 - 50 chars long"
              type="email"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={formik.handleChange}
              variant="outlined"
              error={
                formik.touched.removedReason &&
                Boolean(formik.errors.removedReason)
              }
            />
          </DialogContent>
          {!hideActions && (
            <DialogActions>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button type="submit">Confirm</Button>
                </>
              )}
            </DialogActions>
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default RemoveExamineeDialog;
