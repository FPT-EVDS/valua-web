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
import User from 'models/user.model';
import React from 'react';

interface Props {
  user: User;
  actionButtons: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  isSingleAction?: boolean;
}

const ProfileOverviewCard: React.FC<Props> = ({
  user: { fullName, role, companyId, imageUrl },
  actionButtons,
  isSingleAction = false,
}: Props) => (
  <Card sx={{ minWidth: 275 }}>
    <CardContent>
      <Stack direction="row" spacing={4} justifyContent="space-between">
        <Box>
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 24 }}
            variant="h5"
            gutterBottom
          >
            {fullName}
          </Typography>
          <Box color="text.secondary" marginBottom={1}>
            Company ID:
            <Typography display="inline" ml={0.5}>
              {companyId}
            </Typography>
          </Box>
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
          src={imageUrl ?? undefined}
          alt={`${fullName} avatar`}
        />
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

export default ProfileOverviewCard;
