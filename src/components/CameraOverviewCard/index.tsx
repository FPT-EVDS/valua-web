import {
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import { format } from 'date-fns';
import Status from 'enums/status.enum';
import Camera from 'models/camera.model';
import React from 'react';

interface Props {
  camera: Camera;
  actionButtons: React.ReactNode;
}

const CameraOverviewCard = ({ camera, actionButtons }: Props) => (
  <Card sx={{ minWidth: 275 }} elevation={2}>
    <CardContent>
      <Stack direction="row" spacing={4} justifyContent="space-between">
        <Box>
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 24 }}
            variant="h5"
            gutterBottom
          >
            {camera?.cameraName}
          </Typography>
          <Typography gutterBottom color="text.secondary">
            Last updated:{' '}
            {camera?.lastModifiedDate &&
              format(
                Date.parse(String(camera.lastModifiedDate)),
                'dd/MM/yyyy HH:mm',
              )}
          </Typography>
          <Box color="text.secondary">
            Status:
            <Typography
              display="inline"
              ml={0.5}
              color={
                camera?.status === Status.isDisable ? green[500] : red[500]
              }
            >
              {camera?.status === Status.isDisable ? 'Active' : 'Disable'}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </CardContent>
    {camera.status === Status.isActive && (
      <>
        <Divider />
        <CardActions sx={{ justifyContent: 'space-between' }}>
          {actionButtons}
        </CardActions>
      </>
    )}
  </Card>
);

export default CameraOverviewCard;
