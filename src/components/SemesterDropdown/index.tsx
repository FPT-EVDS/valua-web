import { Autocomplete, TextField } from '@mui/material';
import Semester from 'models/semester.model';
import React, { useEffect, useState } from 'react';
import semesterServices from 'services/semester.service';

interface Props {
  value: Semester | null;
  isEditable: boolean;
  onChange: (semester: Semester | null) => void;
}

const SemesterDropdown = ({ value, isEditable, onChange }: Props) => {
  const [semesterOptions, setSemesterOptions] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSemesters = async () => {
    const response = await semesterServices.getSemesterForShift();
    setSemesterOptions(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSemesters().catch(error => {
      setIsLoading(false);
      console.log(error);
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
          value={value}
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
    />
  );
};

export default SemesterDropdown;
