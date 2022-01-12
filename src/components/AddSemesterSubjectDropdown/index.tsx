/* eslint-disable react/require-default-props */
import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import {
  disableAddSubject,
  enableAddSubject,
} from 'features/semester/detailSemesterSlice';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import subjectServices from 'services/subject.service';

interface Props {
  error?: boolean;
  helperText?: string;
  semesterId?: string;
  onChange: (subjects: Subject[] | null) => void;
}

const AddSemesterSubjectsDropdown = ({
  semesterId,
  onChange,
  helperText,
  error,
}: Props) => {
  const dispatch = useAppDispatch();
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    if (semesterId) {
      const response = await subjectServices.getAvailableSubjects(semesterId);
      if (response.data.length > 0) {
        setSubjectOptions(response.data);
        dispatch(enableAddSubject());
      } else dispatch(disableAddSubject());
    }
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
      multiple
      limitTags={5}
      disableCloseOnSelect
      loading={isLoading}
      options={subjectOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subjectId === optionValue?.subjectId
      }
      getOptionLabel={option => `${option.subjectCode}`}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={<CheckBoxOutlineBlank fontSize="small" />}
            checkedIcon={<CheckBoxIcon fontSize="small" />}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {`${option.subjectCode} - ${option.subjectName}`}
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Subject"
          name="subjects"
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

export default AddSemesterSubjectsDropdown;
