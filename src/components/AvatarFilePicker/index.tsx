import { AddPhotoAlternate } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useRef, useState } from 'react';

interface Props {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarFilePicker = ({ name, onChange }: Props) => {
  const [image, setImageUrl] = useState<string | null>(null);
  const { showErrorMessage } = useCustomSnackbar();
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];
    if (newImage && newImage.type.startsWith('image/')) {
      setImageUrl(URL.createObjectURL(newImage));
      onChange(event);
    } else {
      showErrorMessage('Invalid file type');
    }
  };

  return (
    <label htmlFor="upload-image-button">
      <input
        title="image"
        ref={inputFileRef}
        name={name}
        accept="image/*"
        type="file"
        style={{ display: 'none' }}
        id="upload-image-button"
        onChange={handleOnChange}
      />
      <IconButton component="span">
        <Avatar
          src={String(image)}
          variant="square"
          sx={{ width: 180, height: 180 }}
        >
          <AddPhotoAlternate />
        </Avatar>
      </IconButton>
    </label>
  );
};

export default AvatarFilePicker;
