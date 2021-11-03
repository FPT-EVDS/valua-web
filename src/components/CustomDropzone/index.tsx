/* eslint-disable prefer-destructuring */
import { Add, Cancel, CloudUpload } from '@mui/icons-material';
import {
  Alert,
  Badge,
  Box,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
import { ReactComponent as XLSXIcon } from 'assets/icons/xlsx_icon.svg';
import React, { useEffect, useRef, useState } from 'react';
import { DropzoneState } from 'react-dropzone';

interface Props extends DropzoneState {
  // eslint-disable-next-line react/require-default-props
  handleRemoveFile: (index: number) => void;
}

const CustomDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  acceptedFiles,
  fileRejections,
  handleRemoveFile,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  let borderColor = '#e0e0e0';
  if (isDragAccept) borderColor = green[500];
  if (isDragReject) borderColor = red[500];
  if (isDragActive) borderColor = theme.palette.primary.main;
  const hasUploadFiles = acceptedFiles.length > 0;

  useEffect(() => {
    if (fileRejections.length > 0) setIsOpen(true);
  }, [fileRejections]);

  const handleButtonClick = () => {
    if (buttonRef) buttonRef.current?.click();
  };

  return (
    <>
      {isOpen && (
        <Alert
          severity="error"
          sx={{ marginBottom: 2, display: isOpen ? 'flex' : 'none' }}
          onClose={() => setIsOpen(false)}
        >
          {fileRejections[0].errors[0].message}
        </Alert>
      )}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: hasUploadFiles ? 'row' : 'column',
          justifyContent: hasUploadFiles ? 'flex-start' : 'center',
          alignItems: hasUploadFiles ? 'flex-start' : 'center',
          textAlign: 'center',
          height: 300,
          width: '100%',
          padding: 2,
          borderWidth: 2,
          borderRadius: 2,
          borderColor,
          borderStyle: 'dashed',
          backgroundColor: '#fafafa',
          color: grey[600],
          outline: 'none',
          transition: 'border .24s ease-in-out',
        }}
        {...getRootProps({
          isDragActive,
          isDragAccept,
          isDragReject,
          className: 'dropzone',
        })}
      >
        <input {...getInputProps()} ref={buttonRef} />
        {acceptedFiles.length > 0 ? (
          <>
            {acceptedFiles.map((file, index) => (
              <Stack
                key={file.name}
                justifyContent="center"
                spacing={1}
                alignItems="center"
                marginRight={1}
                sx={{ width: 96 }}
              >
                <Badge
                  key={file.name}
                  badgeContent={
                    <IconButton onClick={() => handleRemoveFile(index)}>
                      <Cancel />
                    </IconButton>
                  }
                >
                  <SvgIcon sx={{ width: 48, height: 48 }}>
                    <XLSXIcon />
                  </SvgIcon>
                </Badge>
                <Typography variant="caption" noWrap sx={{ width: '100%' }}>
                  {file.name}
                </Typography>
              </Stack>
            ))}
            <IconButton onClick={handleButtonClick} sx={{ marginTop: 1 }}>
              <Add />
            </IconButton>
          </>
        ) : (
          <>
            <Box>
              <CloudUpload sx={{ height: 64, width: 64, color: grey[600] }} />
              <Typography
                variant="subtitle1"
                sx={{ width: 300, userSelect: 'none' }}
              >
                Drag and drop spreadsheet file here or click &lsquo;Upload
                files&lsquo; to select files
              </Typography>
            </Box>
            <Button onClick={handleButtonClick}>Upload files</Button>
          </>
        )}
      </Box>
    </>
  );
};

export default CustomDropzone;
