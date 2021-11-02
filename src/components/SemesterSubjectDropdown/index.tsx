/* eslint-disable react/require-default-props */
import { Autocomplete, TextField } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import {
  disableAddSubject,
  enableAddSubject,
} from 'features/semester/detailSemesterSlice';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import semesterServices from 'services/semester.service';

interface Props {
  error?: boolean;
  value?: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>;
  isEditable?: boolean;
  helperText?: string;
  semesterId?: string;
  onChange: (
    subjects: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'> | null,
  ) => void;
}

const SemesterSubjectsDropdown = ({
  semesterId,
  onChange,
  helperText,
  error,
  value,
  isEditable = true,
}: Props) => {
  const dispatch = useAppDispatch();
  const [subjectOptions, setSubjectOptions] = useState<
    Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    if (semesterId) {
      const response = await semesterServices.getSemester(semesterId);
      if (response.data.subjects.length > 0) {
        setSubjectOptions(response.data.subjects);
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
  }, [semesterId]);

  return (
    <Autocomplete
      loading={isLoading}
      disabled={!isEditable}
      options={subjectOptions}
      value={value}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subjectId === optionValue?.subjectId
      }
      getOptionLabel={option => `${option.subjectCode} - ${option.subjectName}`}
      onChange={(event, newValue) => onChange(newValue)}
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

export default SemesterSubjectsDropdown;
