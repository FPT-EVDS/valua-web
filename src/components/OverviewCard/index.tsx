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
  let statusText = '';
  switch (status) {
    case Status.isReady:
      statusColor = '#1890ff';
      statusText = 'Ready';
      break;

    case Status.isActive:
      statusColor = green[500];
      statusText = 'Active';
      break;

    case Status.isDisable:
      statusColor = red[500];
      statusText = 'Inactive';
      break;

    default:
      break;
  }
  return (
    <Card sx={{ minWidth: 275 }}>
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
            <Box color="text.secondary" marginBottom={1}>
              Status:
              <Typography display="inline" ml={0.5} color={statusColor}>
                {statusText}
              </Typography>
            </Box>
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
      <Divider />
      <CardActions
        sx={{ justifyContent: isSingleAction ? 'center' : 'space-between' }}
      >
        {actionButtons}
      </CardActions>
    </Card>
  );
};

export default OverviewCard;
