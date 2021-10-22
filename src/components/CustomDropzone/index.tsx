/* eslint-disable prefer-destructuring */
import { CloudUpload } from '@mui/icons-material';
import { Box, Stack, SvgIcon, Typography, useTheme } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
import { ReactComponent as XLSXIcon } from 'assets/icons/xlsx_icon.svg';
import React from 'react';
import { DropzoneState } from 'react-dropzone';

const CustomDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDragAccept,
  isDragReject,
  acceptedFiles,
}: DropzoneState) => {
  const theme = useTheme();
  let borderColor = '#e0e0e0';
  if (isDragAccept) borderColor = green[500];
  if (isDragReject) borderColor = red[500];
  if (isDragActive) borderColor = theme.palette.primary.main;
  const hasUploadFiles = acceptedFiles.length > 0;

  return (
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
      {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
    >
      <input {...getInputProps()} />
      {acceptedFiles.length > 0 ? (
        acceptedFiles.map(file => (
          <Stack justifyContent="center" spacing={1} alignItems="center">
            <SvgIcon sx={{ width: 48, height: 48 }}>
              <XLSXIcon />
            </SvgIcon>
            <Typography>{file.name}</Typography>
          </Stack>
        ))
      ) : (
        <Box>
          <CloudUpload sx={{ height: 64, width: 64, color: grey[600] }} />
          <Typography variant="subtitle1" sx={{ width: 300 }}>
            Drag and drop spreadsheet file here or click to select files
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CustomDropzone;
