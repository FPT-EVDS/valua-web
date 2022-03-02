import { Assignment, Fullscreen } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { green, orange } from '@mui/material/colors';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import BackToPreviousPageButton from 'components/BackToPreviousPageButton';
import { Lightbox } from 'components/Lightbox';
import NotFoundItem from 'components/NotFoundItem';
import ReportDetailCard from 'components/ReportDetailCard';
import { format } from 'date-fns';
import { getReport } from 'features/report/detailReportSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface ParamProps {
  id: string;
}

interface ImageCardProps {
  imageUrl: string;
}

const ImageCard = ({ imageUrl }: ImageCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Stack spacing={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{ fontWeight: 'medium', fontSize: 20 }}
              variant="h5"
              gutterBottom
            >
              Attached image
            </Typography>
          </Box>
          <Box position="relative">
            <IconButton
              onClick={() => setIsOpen(true)}
              sx={{
                top: '2%',
                left: '90%',
                position: 'absolute',
                color: '#fff',
              }}
            >
              <Fullscreen />
            </IconButton>
            <Box
              component="img"
              src={imageUrl}
              alt="report"
              sx={{
                width: '100%',
                height: '100%',
                maxHeight: 300,
                objectFit: 'cover',
              }}
            />
            <Lightbox
              images={[{ src: imageUrl }]}
              open={isOpen}
              onClose={() => setIsOpen(false)}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const DetailReportPage = () => {
  const dispatch = useAppDispatch();
  const { showErrorMessage } = useCustomSnackbar();
  const { report, isLoading } = useAppSelector(state => state.detailReport);
  const { id } = useParams<ParamProps>();

  const fetchReport = async (appUserId: string) => {
    const actionResult = await dispatch(getReport(appUserId));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchReport(id).catch(error => showErrorMessage(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <BackToPreviousPageButton
        title="Back to report page"
        route="/shift-manager/report"
      />
      {report ? (
        <Grid container mt={2} spacing={2}>
          <Grid item xs={12} md={9} lg={4}>
            <Stack spacing={report.imageUrl ? 2 : 0}>
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={4}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: 'medium', fontSize: 20 }}
                        variant="h5"
                        gutterBottom
                      >
                        {report.examRoom.examRoomName}
                      </Typography>
                      <Typography gutterBottom color="text.secondary">
                        Reported at:{' '}
                        {format(
                          Date.parse(String(report.createdDate)),
                          'dd/MM/yyyy HH:mm',
                        )}
                      </Typography>
                      <Box color="text.secondary" mb={0.5}>
                        Status:
                        <Typography
                          display="inline"
                          ml={0.5}
                          gutterBottom
                          color={report.solution ? green[500] : orange[400]}
                        >
                          {report.solution ? 'Resolved' : 'Pending'}
                        </Typography>
                      </Box>
                      {report.solution && (
                        <Typography color="text.secondary" gutterBottom>
                          Resolved at:{' '}
                          {format(
                            Date.parse(String(report.lastModifiedDate)),
                            'dd/MM/yyyy HH:mm',
                          )}
                        </Typography>
                      )}
                      <Typography color="text.secondary">
                        Reported by:
                      </Typography>
                      <ListItem disableGutters disablePadding>
                        <ListItemAvatar>
                          <Avatar
                            src={String(report.reporter.imageUrl)}
                            alt={report.reporter.fullName}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={report.reporter.fullName}
                          secondary={report.reporter.companyId}
                        />
                      </ListItem>
                    </Box>
                    <Avatar
                      variant="square"
                      sx={{
                        backgroundColor: report.solution
                          ? green[500]
                          : orange[400],
                        borderRadius: '4px',
                        alignSelf: 'center',
                        height: '150px',
                        width: '150px',
                      }}
                    >
                      <Assignment fontSize="large" />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
              {report.imageUrl && <ImageCard imageUrl={report.imageUrl} />}
            </Stack>
          </Grid>
          <Grid item xs={12} lg={8}>
            <ReportDetailCard isLoading={isLoading} report={report} />
          </Grid>
        </Grid>
      ) : (
        <NotFoundItem isLoading={isLoading} message="Report not found" />
      )}
    </div>
  );
};

export default DetailReportPage;
