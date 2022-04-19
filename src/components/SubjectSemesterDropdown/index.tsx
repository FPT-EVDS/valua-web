/* eslint-disable react/require-default-props */
import { Autocomplete, Box, Chip, TextField } from '@mui/material';
import SubjectSemester from 'models/subjectSemester.model';
import React, { useEffect, useState } from 'react';
import subjectExamineesServices from 'services/subjectExaminees.service';

interface Props {
  semesterId: string;
  name: string;
  value: SubjectSemester[];
  onChange: (subjectSemesters: SubjectSemester[]) => void;
  error?: boolean;
  helperText?: string;
}

const SubjectSemesterDropdown = ({
  name,
  semesterId,
  value,
  error,
  helperText,
  onChange,
}: Props) => {
  const [subjectOptions, setSubjectOptions] = useState<SubjectSemester[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    const response = await subjectExamineesServices.searchBySemester({
      semesterId,
    });
    const { subjects } = response.data;
    const options = subjects
      .filter(subject => subject.totalUnassigned > 0)
      .map(({ subject: { subject, subjectSemesterId } }) => ({
        subject,
        subjectSemesterId,
      }));
    setSubjectOptions(options);
    if (subjects.length > 0) {
      onChange(options);
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
      multiple
      filterSelectedOptions
      disableCloseOnSelect
      limitTags={8}
      loading={isLoading}
      options={subjectOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subjectSemesterId === optionValue?.subjectSemesterId
      }
      filterOptions={options => options}
      value={value}
      getOptionLabel={({ subject }) => subject.subjectCode}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.subject.subjectCode}
        </Box>
      )}
      renderTags={(tagValues: SubjectSemester[], getTagProps) =>
        tagValues.map((option, index) => (
          <Chip
            label={option.subject.subjectCode}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={params => (
        <TextField
          {...params}
          label="Subjects"
          error={error}
          helperText={helperText}
          name={name}
          margin="dense"
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

export default SubjectSemesterDropdown;
