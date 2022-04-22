import { TimePicker } from '@mui/lab';
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
import { convertDateToMinutes, convertMinutesToDate } from 'utils';

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
  handleChangeFieldValues: (
    field: string,
    value: unknown,
    shouldValidate?: boolean | undefined,
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          config: ShiftManagerConfig | null;
          role: string | undefined;
        }>
      >;
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

const ShiftManagerSetting = ({
  values,
  handleChange,
  errors,
  handleChangeFieldValues,
}: Props) => {
  const handleChangeStartWorkingDate = async (date: number | null) => {
    if (date) {
      const minutes = convertDateToMinutes(new Date(date));
      await handleChangeFieldValues('config.start', minutes);
    }
  };

  const handleChangeEndWorkingDate = async (date: number | null) => {
    if (date) {
      const minutes = convertDateToMinutes(new Date(date));
      await handleChangeFieldValues('config.end', minutes);
    }
  };

  return (
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
            endAdornment: (
              <InputAdornment position="end">minute</InputAdornment>
            ),
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
            endAdornment: (
              <InputAdornment position="end">minute</InputAdornment>
            ),
            inputProps: { min: 15 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={Boolean(errors?.minutesOfMinDuration)}
          helperText={errors?.minutesOfMinDuration ?? ''}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="number"
          name="config.maxSlotPerExaminee"
          margin="dense"
          label="Max slot per examinee"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={values.maxSlotPerExaminee}
          InputProps={{
            endAdornment: <InputAdornment position="end">slots</InputAdornment>,
            inputProps: { min: 1, max: 3 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={Boolean(errors?.maxSlotPerExaminee)}
          helperText={errors?.maxSlotPerExaminee ?? ''}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="number"
          name="config.minutesPerSlot"
          margin="dense"
          label="Minutes per slot"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={values.minutesPerSlot}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">minute</InputAdornment>
            ),
            inputProps: { min: 10, max: 4.5 * 60 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={Boolean(errors?.minutesPerSlot)}
          helperText={errors?.minutesPerSlot ?? ''}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="number"
          name="config.minutesBetweenShifts"
          margin="dense"
          label="Minutes between shifts"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={values.minutesBetweenShifts}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">minute</InputAdornment>
            ),
            inputProps: { min: 0, max: 30 },
          }}
          InputLabelProps={{
            shrink: true,
          }}
          error={Boolean(errors?.minutesBetweenShifts)}
          helperText={errors?.minutesBetweenShifts ?? ''}
        />
      </Grid>
      <Root>
        <Divider textAlign="center">Working time</Divider>
      </Root>
      <Grid item xs={12}>
        <TimePicker
          label="Start time"
          value={convertMinutesToDate(values.start)}
          onChange={handleChangeStartWorkingDate}
          minTime={new Date(0, 0, 0, 7) as unknown as number}
          maxTime={new Date(0, 0, 0, 17, 59) as unknown as number}
          renderInput={params => (
            <TextField
              {...params}
              name="config.start"
              margin="dense"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors?.start)}
              helperText={errors?.start ?? ''}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <TimePicker
          label="End time"
          value={convertMinutesToDate(values.end)}
          onChange={handleChangeEndWorkingDate}
          minTime={new Date(values.start) as unknown as number}
          maxTime={new Date(0, 0, 0, 17, 59) as unknown as number}
          renderInput={params => (
            <TextField
              {...params}
              name="config.end"
              margin="dense"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              error={Boolean(errors?.end)}
              helperText={errors?.end ?? ''}
            />
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ShiftManagerSetting;
