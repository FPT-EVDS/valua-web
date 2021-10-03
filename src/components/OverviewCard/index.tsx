/* eslint-disable prefer-destructuring */
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import Status from 'enums/status.enum';
import React from 'react';

interface Props {
  title: string;
  content: React.ReactNode;
  status: number;
  icon: React.ReactNode;
  actionButtons: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  isSingleAction?: boolean;
}

const OverviewCard: React.FC<Props> = ({
  title,
  content,
  status,
  icon,
  actionButtons,
  isSingleAction = false,
}: Props) => {
  let statusColor = '#1890ff';
  switch (status) {
    case Status.isReady:
      statusColor = green[500];
      break;

    case Status.isActive:
      statusColor = red[500];
      break;
    case Status.isDisable:
      statusColor = red[500];
      break;
    default:
      break;
  }
  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardContent>
        <Stack direction="row" spacing={4} justifyContent="space-between">
          <Box>
            <Typography
              sx={{ fontWeight: 'medium', fontSize: 24 }}
              variant="h5"
              gutterBottom
            >
              {title}
            </Typography>
            {content}
          </Box>
          <Avatar
            variant="square"
            sx={{
              backgroundColor: statusColor,
              borderRadius: '4px',
              alignSelf: 'stretch',
              height: '150px',
              width: '150px',
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
      {status !== 0 && (
        <>
          <Divider />
          <CardActions
            sx={{ justifyContent: isSingleAction ? 'center' : 'space-between' }}
          >
            {actionButtons}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default OverviewCard;
