/* eslint-disable react/require-default-props */
import {
  Autocomplete,
  Avatar,
  createFilterOptions,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import Account from 'models/account.model';
import React, { useEffect, useState } from 'react';
import examRoomServices from 'services/examRoom.service';

interface Props {
  shiftId: string;
  error?: boolean;
  helperText?: string;
  value: Pick<
    Account,
    | 'appUserId'
    | 'email'
    | 'fullName'
    | 'phoneNumber'
    | 'imageUrl'
    | 'companyId'
  > | null;
  isEditable: boolean;
  onChange: (
    account: Pick<
      Account,
      | 'appUserId'
      | 'email'
      | 'fullName'
      | 'phoneNumber'
      | 'imageUrl'
      | 'companyId'
    > | null,
  ) => void;
}

const filterOptions = createFilterOptions({
  ignoreCase: true,
  stringify: (
    option: Pick<
      Account,
      | 'appUserId'
      | 'email'
      | 'fullName'
      | 'phoneNumber'
      | 'imageUrl'
      | 'companyId'
    >,
  ) => `${option.fullName} ${option.email}`,
});

const StaffDropdown = ({
  shiftId,
  value,
  isEditable,
  onChange,
  error,
  helperText,
}: Props) => {
  const [staffOptions, setStaffOptions] = useState<
    Pick<
      Account,
      | 'appUserId'
      | 'email'
      | 'fullName'
      | 'phoneNumber'
      | 'imageUrl'
      | 'companyId'
    >[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAccounts = async () => {
    const response = await examRoomServices.getAvailableStaff(shiftId);
    const { availableStaffs } = response.data;
    if (value) setStaffOptions([value, ...availableStaffs]);
    else setStaffOptions(availableStaffs);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      disabled={!isEditable}
      loading={isLoading}
      options={staffOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option.appUserId === optionValue.appUserId
      }
      value={value}
      filterOptions={filterOptions}
      getOptionLabel={props => props.fullName}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <ListItem {...props} key={option.appUserId}>
          <ListItemAvatar>
            <Avatar src={String(option.imageUrl)} alt={option.fullName} />
          </ListItemAvatar>
          <ListItemText primary={option.fullName} secondary={option.email} />
        </ListItem>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label="Assigned Staff"
          name="staff"
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
                  src={String(value.imageUrl)}
                  alt={value.fullName}
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

export default StaffDropdown;
