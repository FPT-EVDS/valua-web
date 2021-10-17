/* eslint-disable prefer-destructuring */
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import React from 'react';

interface Props {
  title: string;
  id: string;
  role: string;
  icon: React.ReactNode;
  actionButtons: React.ReactNode;
  isSingleAction?: boolean;
}

const ProfileOverviewCard: React.FC<Props> = ({
  title,
  id,
  role,
  icon,
  actionButtons,
  isSingleAction = false,
}: Props) => {
  const statusColor = '#1890ff';

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
              Role:
              <Typography display="inline" ml={0.5}>
                {role}
              </Typography>
            </Box>
          </Box>
          <Avatar
            variant="square"
            sx={{
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
      <>
          <Divider />
          <CardActions
            sx={{ justifyContent: isSingleAction ? 'center' : 'space-evenly' }}
          >
            {actionButtons}
          </CardActions>
        </>
    </Card>
  );
};

export default ProfileOverviewCard;
