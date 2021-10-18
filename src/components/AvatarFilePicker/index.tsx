import { AddPhotoAlternate } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material';
import React, { useRef, useState } from 'react';

interface Props {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarFilePicker = ({ name, onChange }: Props) => {
  const [image, setImageUrl] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const cleanup = () => {
    URL.revokeObjectURL(String(image));
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImageUrl(URL.createObjectURL(newImage));
      onChange(event);
    }
  };

  return (
    <label htmlFor="upload-image-button">
      <input
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
          sx={{ width: 128, height: 128 }}
        >
          <AddPhotoAlternate />
        </Avatar>
      </IconButton>
    </label>
  );
};

export default AvatarFilePicker;
