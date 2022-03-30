/* eslint-disable react/require-default-props */
import {
  Autocomplete,
  Avatar,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import Examinee from 'models/examinee.model';
import React, { useEffect, useState } from 'react';
import examRoomServices from 'services/examRoom.service';

interface Props {
  shiftId: string;
  subjectSemesterId: string;
  error?: boolean;
  helperText?: string;
  value: Examinee | null;
  isEditable: boolean;
  onChange: (staff: Examinee | null) => void;
}

const ExamineeDropdown = ({
  shiftId,
  subjectSemesterId,
  value,
  isEditable,
  onChange,
  error,
  helperText,
}: Props) => {
  const [examineeOptions, setExamineeOptions] = useState<Examinee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // FIXME: comment for fixing later

  // const fetchAvailableExaminees = async () => {
  //   const response = await examRoomServices.getAvailableExaminees({
  //     shiftId,
  //     subjectSemesterId,
  //   });
  //   const { examinees } = response.data;
  //   if (value) setExamineeOptions([value, ...examinees]);
  //   else setExamineeOptions(examinees);
  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetchAvailableExaminees().catch(() => {
  //     setIsLoading(false);
  //   });
  // }, []);

  return (
    <Autocomplete
      disabled={!isEditable}
      loading={isLoading}
      options={examineeOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option.subjectExamineeID === optionValue.subjectExamineeID
      }
      value={value}
      getOptionLabel={props => props.examinee.fullName}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.subjectExamineeID}>
          <ListItemAvatar>
            <Avatar
              src={String(option.examinee.imageUrl)}
              alt={option.examinee.fullName}
            />
          </ListItemAvatar>
          <ListItemText
            primary={option.examinee.fullName}
            secondary={option.examinee.email}
          />
        </ListItem>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Available examinees"
          name="examinee"
          margin="dense"
          error={error}
          helperText={error && helperText}
          fullWidth
          disabled={!isEditable}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: value && (
              <InputAdornment position="start">
                <Avatar
                  src={String(value.examinee.imageUrl)}
                  alt={value.examinee.fullName}
                  sx={{ width: 28, height: 28 }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export default ExamineeDropdown;
