import { Info } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { green, red } from '@mui/material/colors';
import CustomTooltip from 'components/CustomTooltip';
import { format } from 'date-fns';
import Role from 'enums/role.enum';
import Account from 'models/account.model';
import React from 'react';

interface Props {
  account: Account;
  actionButtons: React.ReactNode;
}

const AccountOverviewCard = ({ account, actionButtons }: Props) => {
  const theme = useTheme();
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
              {account?.fullName}
            </Typography>
            <Typography gutterBottom color="text.secondary">
              Role: {account?.role.roleName}
            </Typography>
            <Box color="text.secondary" marginBottom={1}>
              Status:
              <Typography
                display="inline"
                ml={0.5}
                color={account?.isActive ? green[500] : red[500]}
              >
                {account?.isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
            {account.role.roleName === Role.Examinee && (
              <Box
                display="flex"
                color="text.secondary"
                marginBottom={1}
                alignItems="center"
              >
                Embedded:
                <Typography
                  display="inline"
                  ml={0.5}
                  color={account?.faceDataFileName ? green[500] : red[500]}
                >
                  {account?.faceDataFileName ? 'Yes' : 'No'}
                </Typography>
                <CustomTooltip
                  sx={{ fontSize: 16, ml: 1 }}
                  title={
                    account.faceDataFileName
                      ? 'This examinee has face data and can take attendances for themselves'
                      : "This examinee doesn't have face data and must check attendances manually"
                  }
                  color={
                    account.faceDataFileName
                      ? theme.palette.info.main
                      : theme.palette.error.main
                  }
                >
                  <Info color={account.faceDataFileName ? 'info' : 'error'} />
                </CustomTooltip>
              </Box>
            )}
            <Typography gutterBottom color="text.secondary">
              Last Updated:{' '}
              {account?.lastModifiedDate &&
                format(
                  Date.parse(String(account.lastModifiedDate)),
                  'dd/MM/yyyy HH:mm',
                )}
            </Typography>
          </Box>
          <Avatar
            variant="square"
            sx={{
              borderRadius: '4px',
              alignSelf: 'stretch',
              height: '150px',
              width: '150px',
            }}
            src={String(account?.imageUrl)}
            alt={`${String(account?.fullName)} avatar`}
          />
        </Stack>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between' }}>
        {actionButtons}
      </CardActions>
    </Card>
  );
};

export default AccountOverviewCard;
