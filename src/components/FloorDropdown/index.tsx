/* eslint-disable react/require-default-props */
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useEffect, useState } from 'react';
import roomServices from 'services/room.service';

interface Props {
  value: number | null;
  isEditable: boolean;
  onChange: (floor: number | null) => void;
  textFieldProps?: TextFieldProps;
}

const FloorDropdown = ({
  value,
  isEditable,
  onChange,
  textFieldProps,
}: Props) => {
  const [floorOptions, setFloorOptions] = useState<
    { key: number; value: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorMessage } = useCustomSnackbar();

  const fetchFloors = () => {
    setIsLoading(true);
    roomServices
      .getFloorList()
      .then(response => {
        const { data } = response;
        const options: { key: number; value: string }[] = [];
        Object.keys(data).forEach(key => {
          const dataKey = parseInt(key, 10);
          options.push({
            key: dataKey,
            value: data[dataKey],
          });
        });
        setFloorOptions(options);
        if (value) {
          onChange(options[value].key);
        } else {
          onChange(options[0].key);
        }
        return data;
      })
      .catch(error => showErrorMessage(error))
      .finally(() => setIsLoading(false))
      .catch(error => showErrorMessage(error));
  };

  useEffect(() => {
    fetchFloors();
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      // eslint-disable-next-line unicorn/prefer-spread
      options={Array.from(floorOptions.keys())}
      isOptionEqualToValue={(option, optionValue) => option === optionValue}
      value={value}
      // getOptionLabel={option => option}
      onChange={(event, newValue) => onChange(newValue)}
      getOptionLabel={option =>
        String(floorOptions.find(floor => floor.key === option)?.value)
      }
      renderInput={params => (
        <TextField
          {...params}
          {...textFieldProps}
          margin="dense"
          fullWidth
          disabled={!isEditable}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
};

export default FloorDropdown;
