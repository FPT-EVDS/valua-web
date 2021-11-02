/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-destructuring */
import { Card, CardContent, Link, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import Violation from 'models/violation.model';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

interface Props {
  violation: Violation | null;
  // eslint-disable-next-line react/require-default-props
}

const ViolationInformationCard: React.FC<Props> = ({ violation }: Props) => {
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
    <img src="https://picsum.photos/id/1018/90/90" alt="huy" />,
    <img src="https://picsum.photos/id/1015/90/90" alt="huy" />,
    <img src="https://picsum.photos/id/1019/90/90" alt="huy" />,
    <img src="https://picsum.photos/id/1020/90/90" alt="huy" />,
  ];

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Stack direction="row" spacing={6} justifyContent="space-between">
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 24 }}
            variant="h5"
            gutterBottom
          >
            Violation information
          </Typography>
          <Link
            component={RouterLink}
            to={`/shift-manager/violation/${violation?.violationId}`}
            underline="hover"
          >
            View detail
          </Link>
        </Stack>
        <AliceCarousel
          autoWidth
          disableDotsControls
          paddingLeft={10}
          items={items}
        />
        <Stack
          direction="row"
          spacing={17}
          alignItems="center"
          style={{
            paddingTop: '20px',
          }}
        >
          <Stack direction="column" spacing={1} justifyContent="space-between">
            <Typography style={{ fontWeight: 600 }}>Confirmed by</Typography>
            {violation ? (
              <Typography>{violation.examRoom?.staff?.fullName}</Typography>
            ) : (
              <Typography>N/A</Typography>
            )}
          </Stack>
          <Stack direction="column" spacing={1} justifyContent="space-between">
            <Typography style={{ fontWeight: 600 }}>Violation date</Typography>
            <Typography variant="subtitle2">
              {violation &&
                format(
                  Date.parse(String(violation?.createdDate)),
                  'dd/MM/yyyy HH:mm',
                )}
            </Typography>
          </Stack>
        </Stack>
        <Stack
          direction="column"
          spacing={1}
          justifyContent="space-between"
          style={{
            paddingTop: '20px',
          }}
        >
          <Typography style={{ fontWeight: 600 }}>Description</Typography>
          <Typography variant="subtitle2">{violation?.description}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ViolationInformationCard;
