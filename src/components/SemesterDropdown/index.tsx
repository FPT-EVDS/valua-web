import { Autocomplete, TextField, TextFieldProps } from '@mui/material';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';
import semesterServices from 'services/semester.service';

interface Props {
  value: Pick<Semester, 'semesterId' | 'semesterName'> | null;
  isEditable: boolean;
  onChange: (
    semester: Pick<Semester, 'semesterId' | 'semesterName'> | null,
  ) => void;
  // eslint-disable-next-line react/require-default-props
  textFieldProps?: TextFieldProps;
}

const SemesterDropdown = ({
  value,
  isEditable,
  onChange,
  textFieldProps,
}: Props) => {
  const [semesterOptions, setSemesterOptions] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSemesters = async () => {
    const response = await semesterServices.getSemesterForShift();
    setSemesterOptions(response.data);
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
      renderInput={params => (
        <TextField
          {...params}
          {...textFieldProps}
          label="Semester"
          name="semester"
          autoFocus
          margin="dense"
          fullWidth
          disabled={!isEditable}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
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
