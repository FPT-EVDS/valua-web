import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import ViolationDto from 'dtos/violation.dto';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Violation from 'models/violation.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface Props {
  violation: Violation;
  isLoading: boolean;
}

const images = [
  {
    original: 'https://picsum.photos/id/1018/1000/600/',
    thumbnail: 'https://picsum.photos/id/1018/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1015/1000/600/',
    thumbnail: 'https://picsum.photos/id/1015/250/150/',
  },
  {
    original: 'https://picsum.photos/id/1019/1000/600/',
    thumbnail: 'https://picsum.photos/id/1019/250/150/',
  },
];

const items = [
  <img src="https://picsum.photos/id/1018/150/150" alt="huy" />,
  <img src="https://picsum.photos/id/1015/150/150" alt="huy" />,
  <img src="https://picsum.photos/id/1019/150/150" alt="huy" />,
];

const responsive = {
  0: { items: 1 },
  568: { items: 2 },
  1024: { items: 3 },
};

const ViolationDetailCard = ({ violation, isLoading }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true',
  );
  const initialValues: ViolationDto = { ...violation };
  const formik = useFormik({
    initialValues,
    onSubmit: async (payload: ViolationDto) => {
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
    if (violation) {
      await formik.setValues({
        ...violation,
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
  }, [violation]);

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Violation Infomartion
          </Typography>
        }
      />
      <Box component="form">
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                autoFocus
                name="Shift name"
                margin="dense"
                label="Violation name"
                fullWidth
                variant="outlined"
                value={formik.values.examRoom?.examRoomName}
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
                name="addedBy"
                margin="dense"
                label="Reported by"
                fullWidth
                variant="outlined"
                value={formik.values.examRoom?.staff?.fullName}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                margin="dense"
                variant="outlined"
                fullWidth
                label="Violation position"
                value="Nay de demo thoi chua co field nay"
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
                value={formik.values.description}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom color="text.secondary">
                Evidence
              </Typography>
            </Grid>
            <AliceCarousel
              autoWidth
              innerWidth={3}
              disableDotsControls
              paddingLeft={10}
              items={items}
            />
          </Grid>
        </CardContent>
      </Box>
    </Card>
  );
};

export default ViolationDetailCard;
