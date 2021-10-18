import { Autocomplete, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import Status from 'enums/status.enum';
import {
  disableAddCamera,
  enableAddCamera,
} from 'features/room/detailRoomSlice';
import Camera from 'models/camera.model';
import React, { useEffect, useState } from 'react';
import cameraServices from 'services/camera.service';

interface Props {
  onChange: (camera: Camera | null) => void;
}

const CameraDropdown = ({ onChange }: Props) => {
  const dispatch = useAppDispatch();
  const [cameraOptions, setCameraOptions] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCameras = async () => {
    const response = await cameraServices.searchCameras({
      search: '',
      status: Status.isActive,
      page: 0,
    });
    if (response.data.cameras.length > 0) {
      setCameraOptions(response.data.cameras);
      dispatch(enableAddCamera());
    } else dispatch(disableAddCamera());
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    fetchCameras().catch(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <Autocomplete
      loading={isLoading}
      options={cameraOptions}
      isOptionEqualToValue={(option, optionValue) =>
        option.cameraId === optionValue.cameraId
      }
      disabled={cameraOptions.length === 0}
      getOptionLabel={option => option.cameraName}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={params => (
        <TextField
          {...params}
          label="Camera"
          name="camera"
          autoFocus
          margin="dense"
          fullWidth
          helperText={
            cameraOptions.length === 0 && 'No camera left to assigned'
          }
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
    />
  );
};

export default CameraDropdown;
