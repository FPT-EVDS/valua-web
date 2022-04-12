/* eslint-disable react/require-default-props */
import { Autocomplete, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { updateDropdown } from 'features/examRoom/addExamRoomSlice';
import Semester from 'models/semester.model';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import examRoomServices from 'services/examRoom.service';

interface Props {
  error?: boolean;
  value?: {
    semester: Pick<Semester, 'semesterId' | 'semesterName'>;
    subject: Subject;
    subjectSemesterId: string;
  };
  isEditable?: boolean;
  helperText?: string;
  shiftId?: string | null;
  onChange: (
    subjects: {
      semester: Pick<Semester, 'semesterId' | 'semesterName'>;
      subject: Subject;
      subjectSemesterId: string;
    } | null,
  ) => void;
}

const SubjectExamineeSemesterDropdown = ({
  shiftId,
  onChange,
  helperText,
  error,
  value,
  isEditable = true,
}: Props) => {
  const dispatch = useAppDispatch();
  const { shouldUpdateDropdown } = useAppSelector(state => state.addExamRoom);
  const [subjectOptions, setSubjectOptions] = useState<
    Array<{
      numOfAvailable: number;
      subject: {
        semester: Pick<Semester, 'semesterId' | 'semesterName'>;
        subject: Subject;
        subjectSemesterId: string;
      };
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<{
    numOfAvailable: number;
    subject: {
      semester: Pick<Semester, 'semesterId' | 'semesterName'>;
      subject: Subject;
      subjectSemesterId: string;
    };
  }>();

  const fetchSubjects = async () => {
    if (shiftId) {
      const response = await examRoomServices.getAvailableShifts(shiftId);
      if (response.data.availableSubjects.length > 0) {
        setSubjectOptions(response.data.availableSubjects);
        setSelectedValue(
          response.data.availableSubjects.find(
            subject =>
              subject.subject.subjectSemesterId === value?.subjectSemesterId,
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
  }, [shiftId]);

  useEffect(() => {
    if (shouldUpdateDropdown) {
      setIsLoading(true);
      fetchSubjects()
        .then(() => dispatch(updateDropdown(false)))
        .catch(() => {
          setIsLoading(false);
        });
    }
  }, [shouldUpdateDropdown]);

  useEffect(() => {
    setSelectedValue(
      subjectOptions.find(
        subject =>
          subject.subject.subjectSemesterId === value?.subjectSemesterId,
      ),
    );
  }, [value]);

  return (
    <Autocomplete
      disableClearable
      loading={isLoading}
      disabled={!isEditable}
      options={subjectOptions}
      value={selectedValue}
      isOptionEqualToValue={(option, optionValue) =>
        option?.subject.subjectSemesterId ===
        optionValue?.subject.subjectSemesterId
      }
      getOptionLabel={option =>
        `${option.subject.subject.subjectCode} - Available: ${option.numOfAvailable}`
      }
      onChange={(event, newValue) => {
        if (newValue) onChange(newValue.subject);
      }}
      renderInput={params => (
        <TextField
          {...params}
          required
          label="Subject"
          name="subjects"
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
