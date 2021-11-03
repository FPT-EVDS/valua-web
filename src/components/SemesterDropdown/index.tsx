/* eslint-disable react/require-default-props */
import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import SearchByDateDto from 'dtos/searchByDate.dto';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';
import semesterServices from 'services/semester.service';

interface Props {
  value: Pick<Semester, 'semesterId' | 'semesterName'> | null;
  isEditable: boolean;
  onChange: (
    semester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => void;
  textFieldProps?: TextFieldProps;
  payload?: SearchByDateDto;
}

const SemesterDropdown = ({
  value,
  isEditable,
  onChange,
  textFieldProps,
  payload,
}: Props) => {
  const [semesterOptions, setSemesterOptions] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSemesters = async () => {
    const response = await semesterServices.getSemesterForShift(payload);
    setSemesterOptions(response.data);
    if (value) {
      onChange(value);
    } else {
      onChange(response.data[0]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSemesters().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      options={semesterOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.semesterId === optionValue?.semesterId
      }
      getOptionLabel={option => option.semesterName || ''}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      disabled={!isEditable}
      renderInput={params => (
        <TextField
          {...params}
          {...textFieldProps}
          margin="dense"
          fullWidth
          disabled={!isEditable}
          variant="outlined"
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.semesterId}>
          {option.semesterName}
        </li>
      )}
      ListboxProps={{
        style: {
          maxHeight: '320px',
        },
      }}
    />
  );
};

export default SemesterDropdown;
