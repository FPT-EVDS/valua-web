import {
  Divider,
  Grid,
  Slider,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import FloorSettingDropdown from 'components/FloorSettingDropdown';
import { FormikErrors } from 'formik';
import { ManagerConfig } from 'models/config.model';
import React from 'react';

interface Props {
  values: ManagerConfig;
  errors: FormikErrors<ManagerConfig> | undefined;
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
          config: ManagerConfig | null;
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

const ManagerSetting = ({
  values,
  handleChange,
  handleChangeFieldValues,
  errors,
}: Props) => {
  const handleChangeFloors = async (floors: string[] | null) => {
    if (floors) {
      const data = Object.fromEntries(
        floors.map((value, index) => [index, value]),
      );
      await handleChangeFieldValues('config.roomConfig.floor', data);
    } else {
      await handleChangeFieldValues('config.roomConfig.floor', null);
    }
  };

  return (
    <Grid container spacing={1}>
      <Root>
        <Divider textAlign="center">Room setting</Divider>
      </Root>
      <Grid item xs={12} mb={2}>
        <FloorSettingDropdown
          onChange={async floors => {
            await handleChangeFloors(floors);
          }}
          value={values.roomConfig.floor}
          name="config.roomConfig.floor"
          error={Boolean(errors?.roomConfig?.floor)}
          helperText={String(errors?.roomConfig?.floor)}
        />
      </Grid>
      <Root>
        <Divider textAlign="center">Exam room setting</Divider>
      </Root>
      <Grid item xs={12} mb={2}>
        <TextField
          name="config.examRoomConfig.reservedStaffCode"
          margin="dense"
          label="Reserved staff code"
          fullWidth
          variant="outlined"
          onChange={handleChange}
          value={values.examRoomConfig.reservedStaffCode}
          InputLabelProps={{
            shrink: true,
          }}
          error={Boolean(errors?.examRoomConfig?.reservedStaffCode)}
          helperText={errors?.examRoomConfig?.reservedStaffCode ?? ''}
        />
      </Grid>
      <Root>
        <Divider textAlign="center">A.I setting</Divider>
      </Root>
      <Grid item xs={12} mb={2}>
        <Typography gutterBottom>A.I Threshold</Typography>
        <Slider
          name="config.aiConfig.AIThreshold"
          valueLabelDisplay="on"
          step={0.05}
          marks
          min={0}
          value={values.aiConfig.AIThreshold}
          max={1}
          onChange={async (_e, value) => {
            await handleChangeFieldValues('config.aiConfig.AIThreshold', value);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ManagerSetting;
