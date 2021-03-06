/* eslint-disable react/require-default-props */
import { Autocomplete, TextField } from '@mui/material';
import Room from 'models/room.model';
import React, { useEffect, useState } from 'react';
import examRoomServices from 'services/examRoom.service';

interface Props {
  shiftId: string;
  error?: boolean;
  helperText?: string;
  value: Pick<
    Room,
    'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'
  > | null;
  isEditable: boolean;
  onChange: (
    examRoom: Pick<
      Room,
      'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'
    > | null,
  ) => void;
}

const RoomDropdown = ({
  shiftId,
  value,
  isEditable,
  onChange,
  error,
  helperText,
}: Props) => {
  const [roomOptions, setRoomOptions] = useState<
    Pick<Room, 'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'>[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRooms = async () => {
    const response = await examRoomServices.getAvailableExamRooms({
      shiftId,
    });
    const { emptyRooms } = response.data;
    if (value) setRoomOptions([value, ...emptyRooms]);
    else setRoomOptions([...emptyRooms]);
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
      disabled={!isEditable}
      renderInput={params => (
        <TextField
          {...params}
          label="Room"
          name="examRoom"
          margin="dense"
          fullWidth
          error={error}
          helperText={error && helperText}
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
