import { Autocomplete, TextField } from '@mui/material';
import Room from 'models/room.model';
import React, { useEffect, useState } from 'react';
import roomServices from 'services/room.service';

interface Props {
  value: Room | null;
  isEditable: boolean;
  onChange: (examRoom: Room | null) => void;
}

const RoomDropdown = ({ value, isEditable, onChange }: Props) => {
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRooms = async () => {
    const response = await roomServices.getRoomsForShift();
    setRoomOptions(response.data);
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchRooms().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      options={roomOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option.roomId === optionValue.roomId
      }
      value={value}
      getOptionLabel={option => `${option.roomName} - Floor ${option.floor}`}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          label="Exam room"
          name="examRoom"
          autoFocus
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

export default RoomDropdown;
