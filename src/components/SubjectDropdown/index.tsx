import { Autocomplete, TextField } from '@mui/material';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import subjectServices from 'services/subject.service';

interface Props {
  value: Subject | null;
  isEditable: boolean;
  onChange: (subject: Subject | null) => void;
}

const SubjectDropdown = ({ value, isEditable, onChange }: Props) => {
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    const response = await subjectServices.getSubjectsForShift();
    setSubjectOptions(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSubjects().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      options={subjectOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subjectId === optionValue?.subjectId
      }
      value={value}
      getOptionLabel={option => `${option.subjectCode} - ${option.subjectName}`}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          label="Subject"
          name="subject"
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

export default SubjectDropdown;
