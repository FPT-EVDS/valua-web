/* eslint-disable prefer-destructuring */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import { green } from '@mui/material/colors';
import Status from 'enums/feedbackStatus.enum';
import React from 'react';

interface Props {
  title: string;
  content: React.ReactNode;
  status: number;
  icon: React.ReactNode;
  imageUrl: React.ReactNode;
  fullName: string | undefined;
  // eslint-disable-next-line react/require-default-props
}

const FeedbackOverviewCard: React.FC<Props> = ({
  title,
  content,
  status,
  icon,
  imageUrl,
  fullName,
}: Props) => {
  let statusColor = '#F7D154';
  let statusText = '';
  switch (status) {
    case Status.isPending:
      statusColor = '#F7D154';
      statusText = 'Pending';
      break;

    case Status.isResolved:
      statusColor = green[500];
      statusText = 'Resolved';
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
              Feedback title
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
        <>
          <Stack direction="row" spacing={2}>
              <Avatar alt={fullName} src={imageUrl?.toString()} />
              <Stack direction="column">
                <Typography>Submitted by:</Typography>
                <Typography>{fullName}</Typography>
              </Stack>
            </Stack>
        </>
      </CardContent>
    </Card>
  );
};

export default FeedbackOverviewCard;
