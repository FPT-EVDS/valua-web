/* eslint-disable react/require-default-props */
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import LoadingIndicator from 'components/LoadingIndicator';
import React from 'react';

interface Props {
  color: string;
  children?: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  isLoading?: boolean;
}

const DashboardCard = ({
  icon,
  subtitle,
  title,
  children,
  color,
  isLoading = false,
}: Props) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      {!isLoading ? (
        <>
          <Grid
            container
            spacing={3}
            marginBottom={1}
            justifyContent="space-between"
          >
            <Grid item>
              <Typography
                color="textSecondary"
                gutterBottom
                variant="overline"
                fontWeight={700}
              >
                {subtitle}
              </Typography>
              <Typography color="textPrimary" variant="h4" fontWeight={700}>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Avatar
                sx={{
                  backgroundColor: color,
                  height: 56,
                  width: 56,
                }}
              >
                {icon}
              </Avatar>
            </Grid>
          </Grid>
          {children}
        </>
      ) : (
        <LoadingIndicator />
      )}
    </CardContent>
  </Card>
);

export default DashboardCard;
