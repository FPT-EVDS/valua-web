/* eslint-disable react/require-default-props */
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

interface Props {
  color: string;
  children?: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const DashboardCard = ({ icon, subtitle, title, children, color }: Props) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
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
    </CardContent>
  </Card>
);

export default DashboardCard;
