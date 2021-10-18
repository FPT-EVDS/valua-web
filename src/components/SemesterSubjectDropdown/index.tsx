import {
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank,
} from '@mui/icons-material';
import { Autocomplete, Checkbox, TextField } from '@mui/material';
import { useAppDispatch } from 'app/hooks';
import { AddSubjectToSemesterDto } from 'dtos/addSubjectToSemester.dto';
import {
  disableAddSubject,
  enableAddSubject,
} from 'features/semester/detailSemesterSlice';
import { FormikErrors, FormikTouched } from 'formik';
import Subject from 'models/subject.model';
import React, { useEffect, useState } from 'react';
import subjectServices from 'services/subject.service';

interface Props {
  errors: FormikErrors<AddSubjectToSemesterDto>;
  touched: FormikTouched<AddSubjectToSemesterDto>;
  semesterId: string;
  onChange: (subject: Subject[] | null) => void;
}

const SemesterSubjectDropdown = ({
  semesterId,
  onChange,
  touched,
  errors,
}: Props) => {
  const dispatch = useAppDispatch();
  const [subjectOptions, setSubjectOptions] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSubjects = async () => {
    const response = await subjectServices.getAvailableSubjects(semesterId);
    if (response.data.length > 0) {
      setSubjectOptions(response.data);
      dispatch(enableAddSubject());
    } else dispatch(disableAddSubject());
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
          error={touched.subjects && Boolean(errors.subjects)}
          helperText={touched.subjects && errors.subjects}
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

export default SemesterSubjectDropdown;
