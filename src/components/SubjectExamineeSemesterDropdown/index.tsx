/* eslint-disable react/require-default-props */
import { Autocomplete, TextField } from '@mui/material';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import subjectExamineesServices from 'services/subjectExaminees.service';

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

const SubjectExamineeSemesterDropdown = ({
  semesterId,
  onChange,
  helperText,
  error,
  value,
  isEditable = true,
}: Props) => {
  const [subjectOptions, setSubjectOptions] = useState<
    Array<{
      totalExaminees: number;
      totalUnassigned: number;
      subject: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>;
      isReady: boolean;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<{
    totalExaminees: number;
    totalUnassigned: number;
    subject: Pick<Subject, 'subjectId' | 'subjectName' | 'subjectCode'>;
    isReady: boolean;
  }>();

  const fetchSubjects = async () => {
    if (semesterId) {
      const response = await subjectExamineesServices.searchBySemester({
        semesterId,
        isReady: 0,
      });
      if (response.data.subjects.length > 0) {
        setSubjectOptions(response.data.subjects);
        setSelectedValue(
          response.data.subjects.find(
            subject => subject.subject.subjectId === value?.subjectId,
          ),
        );
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchSubjects().catch(() => {
      setIsLoading(false);
    });
  }, [semesterId]);

  useEffect(() => {
    setSelectedValue(
      subjectOptions.find(
        subject => subject.subject.subjectId === value?.subjectId,
      ),
    );
  }, [value]);

  return (
    <Autocomplete
      loading={isLoading}
      disabled={!isEditable}
      options={subjectOptions}
      value={selectedValue}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subject.subjectId === optionValue?.subject.subjectId
      }
      getOptionLabel={option =>
        `${option.subject.subjectCode} - Unassigned: ${option.totalUnassigned}`
      }
      onChange={(event, newValue) => {
        if (newValue) onChange(newValue.subject);
      }}
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

export default SubjectExamineeSemesterDropdown;
