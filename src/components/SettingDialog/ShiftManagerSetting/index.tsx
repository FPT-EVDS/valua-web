import {
  Divider,
  Grid,
  InputAdornment,
  styled,
  TextField,
} from '@mui/material';
import { FormikErrors } from 'formik';
import { ShiftManagerConfig } from 'models/config.model';
import React from 'react';

interface Props {
  values: ShiftManagerConfig;
  errors: FormikErrors<ShiftManagerConfig> | undefined;
  handleChange: {
    (e: React.ChangeEvent<unknown>): void;
    <T_1 = string | React.ChangeEvent<unknown>>(
      field: T_1,
    ): T_1 extends React.ChangeEvent<unknown>
      ? void
      : (e: string | React.ChangeEvent<unknown>) => void;
  };
}

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.h6,
  fontSize: 16,
  marginBottom: theme.spacing(2),
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const ShiftManagerSetting = ({ values, handleChange, errors }: Props) => (
  <Grid container spacing={1}>
    <Root>
      <Divider textAlign="center">Shift setting</Divider>
    </Root>
    <Grid item xs={12}>
      <TextField
        type="number"
        name="config.hoursBeforeShiftStarts"
        margin="dense"
        label="Hours before shift starts"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={values.hoursBeforeShiftStarts}
        InputProps={{
          endAdornment: <InputAdornment position="end">hour</InputAdornment>,
          inputProps: { min: 0 },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors?.hoursBeforeShiftStarts)}
        helperText={errors?.hoursBeforeShiftStarts ?? ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        type="number"
        name="config.hoursOfMaxDuration"
        margin="dense"
        label="Hours of max duration"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={values.hoursOfMaxDuration}
        InputProps={{
          endAdornment: <InputAdornment position="end">hour</InputAdornment>,
          inputProps: { min: 1 },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors?.hoursOfMaxDuration)}
        helperText={errors?.hoursOfMaxDuration ?? ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        type="number"
        // eslint-disable-next-line no-secrets/no-secrets
        name="config.hoursToSendLockShiftWarningBeforeStart"
        margin="dense"
        label="Hour to send lock shift warning before start"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={values.hoursToSendLockShiftWarningBeforeStart}
        InputProps={{
          endAdornment: <InputAdornment position="end">hour</InputAdornment>,
          inputProps: { min: 0 },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors?.hoursToSendLockShiftWarningBeforeStart)}
        helperText={errors?.hoursToSendLockShiftWarningBeforeStart ?? ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        type="number"
        name="config.minutesBeforeForceFinish"
        margin="dense"
        label="Minutes before force finish"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={values.minutesBeforeForceFinish}
        InputProps={{
          endAdornment: <InputAdornment position="end">minute</InputAdornment>,
          inputProps: { min: 0 },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors?.minutesBeforeForceFinish)}
        helperText={errors?.minutesBeforeForceFinish ?? ''}
      />
    </Grid>
    <Grid item xs={12}>
      <TextField
        type="number"
        name="config.minutesOfMinDuration"
        margin="dense"
        label="Minutes of min duration"
        fullWidth
        variant="outlined"
        onChange={handleChange}
        value={values.minutesOfMinDuration}
        InputProps={{
          endAdornment: <InputAdornment position="end">minute</InputAdornment>,
          inputProps: { min: 15 },
        }}
        InputLabelProps={{
          shrink: true,
        }}
        error={Boolean(errors?.minutesOfMinDuration)}
        helperText={errors?.minutesOfMinDuration ?? ''}
      />
    </Grid>
  </Grid>
);

export default ShiftManagerSetting;
