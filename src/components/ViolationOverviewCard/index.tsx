/* eslint-disable arrow-body-style */
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
import React from 'react';

interface Props {
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
}

const ViolationOverviewCard: React.FC<Props> = ({
  title,
  content,
  icon,
}: Props) => {
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
            {content}
          </Box>
          <Avatar
            variant="square"
            sx={{
              backgroundColor: green[500],
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
    </Card>
  );
};

export default ViolationOverviewCard;
