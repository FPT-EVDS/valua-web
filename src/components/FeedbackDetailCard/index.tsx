import { LoadingButton } from '@mui/lab';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import FeedbackDto from 'dtos/feedback.dto';
import FeedbackStatus from 'enums/feedbackStatus.enum';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Feedback from 'models/feedback.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

interface Props {
  feedback: Feedback;
  isLoading: boolean;
}

const FeedbackDetailCard = ({ feedback, isLoading }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: FeedbackDto = { ...feedback };
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: FeedbackDto) => {
      try {
        const data = {
          ...payload,
        };
      } catch (error) {
        enqueueSnackbar(error, {
          variant: 'error',
          preventDuplicate: true,
        });
      }
    },
  });

  const refreshFormValues = async () => {
    if (feedback) {
      await formik.setValues({
        ...feedback,
      });
    }
  };

  useEffect(() => {
    refreshFormValues().catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Feedback Infomartion
          </Typography>
        }
      />
      <Box component="form">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="shiftId"
                margin="dense"
                label="Shift ID"
                fullWidth
                variant="outlined"
                value={formik.values.feedbackId}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                disabled={!isEditable}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="submittedAt"
                margin="dense"
                label="Submitted At"
                fullWidth
                variant="outlined"
                value={formik.values.createdDate}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Title"
                value="Something wrong"
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                autoFocus
                margin="dense"
                disabled
                label="Description"
                fullWidth
                value={formik.values.content}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
        {feedback?.status === FeedbackStatus.isPending && (
          <>
            <Divider />
            <CardActions>
              <LoadingButton
                disabled={false}
                loading={isLoading}
                type="submit"
                variant="contained"
              >
                Resolve
              </LoadingButton>
            </CardActions>
          </>
        )}
      </Box>
    </Card>
  );
};

export default FeedbackDetailCard;
