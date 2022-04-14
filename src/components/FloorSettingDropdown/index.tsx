/* eslint-disable react/require-default-props */
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Props {
  name: string;
  error?: boolean;
  helperText?: string;
  onChange: (floors: string[] | null) => void;
  value?: { [key: number]: string };
}

const FloorSettingDropdown = ({
  onChange,
  helperText,
  error,
  name,
  value = [],
}: Props) => {
  const [floorOptions, setFloorOptions] = useState<string[]>([]);

  useEffect(() => {
    const options: string[] = [];
    Object.keys(value).forEach(key => {
      const dataKey = parseInt(key, 10);
      options.push(value[dataKey]);
    });
    setFloorOptions(options);
  }, [value]);

  return (
    <Autocomplete
      multiple
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      value={floorOptions}
      options={floorOptions}
      // Don't show autocomplete options
      filterOptions={() => []}
      getOptionLabel={option => option}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option}
        </Box>
      )}
      renderTags={(tagValues, getTagProps) =>
        tagValues.map((option, index) => (
          <Chip label={option} {...getTagProps({ index })} />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label="Floor list"
          name={name}
          margin="dense"
          error={error}
          helperText={error && helperText}
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
};

export default FloorSettingDropdown;
