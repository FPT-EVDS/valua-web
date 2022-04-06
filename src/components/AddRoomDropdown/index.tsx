/* eslint-disable react/require-default-props */
import { Autocomplete, TextField } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import Room from 'models/room.model';
import React, { useEffect, useState } from 'react';
import examRoomServices from 'services/examRoom.service';

interface Props {
  shiftId: string;
  value: Room[] | null;
  error?: boolean;
  helperText?: string;
  isEditable: boolean;
  onChange: (room: Room[] | null) => void;
}

const AddRoomDropdown = ({
  shiftId,
  isEditable,
  onChange,
  error,
  helperText,
}: Props) => {
  const examRooms = useAppSelector(state => state.addExamRoom.examRooms);
  const [roomOptions, setRoomOptions] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRooms = async () => {
    const response = await examRoomServices.getAvailableExamRooms({
      shiftId,
    });
    if (examRooms) {
      const roomIds = examRooms.examRooms.map(examRoom => examRoom.room.roomId);
      const { emptyRooms, occupiedRooms } = response.data;
      setRoomOptions(
        [...emptyRooms, ...occupiedRooms].filter(
          room => !roomIds?.includes(room.roomId),
        ),
      );
    }
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
      multiple
      disableCloseOnSelect
      loading={isLoading}
      options={roomOptions}
      limitTags={3}
      isOptionEqualToValue={(option, optionValue) =>
        option.roomId === optionValue.roomId
      }
      groupBy={option => (option.lastPosition ? 'Occupied' : 'Empty')}
      getOptionLabel={option => {
        const availableSeats = option.lastPosition
          ? option.seatCount - parseInt(String(option.lastPosition), 10)
          : option.seatCount;
        return `${option.roomName} - Floor ${option.floor} - Available: ${availableSeats}`;
      }}
      onChange={(event, newValue) => onChange(newValue)}
      disabled={!isEditable}
      renderInput={params => (
        <TextField
          {...params}
          required
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

export default AddRoomDropdown;
