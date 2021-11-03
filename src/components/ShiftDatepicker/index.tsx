import { DatePicker, PickersDay, PickersDayProps } from '@mui/lab';
import { Badge, TextField } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import { format } from 'date-fns';
import React from 'react';

interface Props {
  // eslint-disable-next-line react/require-default-props
  activeDate: Record<string, number> | null;
  value: Date | null;
  handleChangeDate: (selectedDate: Date | null) => void;
}

const ShiftDatepicker = ({ activeDate, value, handleChangeDate }: Props) => {
  const isLoading = useAppSelector(state => state.shift.isLoading);
  const renderDay = (
    day: Date,
    selectedDates: (Date | null)[],
    pickersDayProps: PickersDayProps<Date>,
  ): JSX.Element => {
    const hasShift = activeDate
      ? Object.entries(activeDate).findIndex(
          ([key, _value]) =>
            format(new Date(String(day)), 'yyyy-MM-dd') === key && _value > 0,
        ) > -1
      : false;
    return (
      <Badge
        key={day.toString()}
        color="primary"
        overlap="circular"
        variant="dot"
        invisible={!hasShift}
      >
        <PickersDay {...pickersDayProps} />
      </Badge>
    );
  };

  return (
    <DatePicker
      value={value}
      inputFormat="dd/MM/yyyy"
      onChange={handleChangeDate}
      loading={isLoading}
      renderInput={params => (
        <TextField
          {...params}
          sx={{ maxWidth: 200 }}
          size="small"
          margin="dense"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
      renderDay={renderDay}
    />
  );
};

export default ShiftDatepicker;
