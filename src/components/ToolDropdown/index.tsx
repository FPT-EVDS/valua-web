/* eslint-disable react/require-default-props */
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import { activeTool } from 'features/tool/toolsSlice';
import Tool from 'models/tool.model';
import React, { useCallback, useEffect, useState } from 'react';
import toolServices from 'services/tool.service';
import { debounce } from 'utils';

interface Props {
  error?: boolean;
  disabled: boolean;
  helperText?: string;
  onChange: (tools: Tool[] | null) => void;
  value?: Tool[];
}

const ToolDropdown = ({
  onChange,
  helperText,
  error,
  value = [],
  disabled,
}: Props) => {
  const [toolOptions, setToolOptions] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTools = async (search?: string) => {
    const response = await toolServices.searchTools({ search });
    const { tools } = response.data;
    // Get active tools only
    const activeTools = tools.filter(tool => tool.isActive === true);
    setToolOptions(activeTools);
    setIsLoading(false);
  };

  const debounceCall = useCallback(
    debounce((searchValue: string) => fetchTools(searchValue), 500),
    [],
  );

  const updateValue = (newValue: string) => {
    setIsLoading(true);
    debounceCall(newValue).catch(error_ => setToolOptions([]));
  };

  useEffect(() => {
    setIsLoading(true);
    fetchTools().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      multiple
      disabled={disabled}
      value={value}
      filterSelectedOptions
      limitTags={4}
      disableCloseOnSelect
      loading={isLoading}
      options={toolOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.toolId === optionValue?.toolId
      }
      filterOptions={options => options}
      getOptionLabel={option => `${option.toolName}`}
      onInputChange={(event, newInputValue) => {
        updateValue(newInputValue);
      }}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {`${option.toolCode} - ${option.toolName}`}
        </Box>
      )}
      renderTags={(tagValues: Tool[], getTagProps) =>
        tagValues.map((option, index) => (
          <Chip
            label={option.toolName}
            color={option.isActive ? 'primary' : 'default'}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label="Tool"
          name="tools"
          autoFocus
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

export default ToolDropdown;
