import {
  Autocomplete,
  Avatar,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
} from '@mui/material';
import Account from 'models/account.model';
import React, { useEffect, useState } from 'react';
import accountServices from 'services/account.service';

interface Props {
  value: Account | null;
  isEditable: boolean;
  onChange: (account: Account | null) => void;
}

const StaffDropdown = ({ value, isEditable, onChange }: Props) => {
  const [staffOptions, setStaffOptions] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAccounts = async () => {
    const response = await accountServices.getAllStaffForShift();
    setStaffOptions(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts().catch(error => {
      setIsLoading(false);
      console.log(error);
    });
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      options={staffOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option?.appUserId === optionValue?.appUserId
      }
      value={value}
      getOptionLabel={props => props.fullName}
      onChange={(event, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <ListItem key={option.appUserId} {...props}>
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
          autoFocus
          margin="dense"
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
