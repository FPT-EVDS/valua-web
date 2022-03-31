/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { CloudUpload } from '@mui/icons-material';
import { Alert, Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { green, grey, red } from '@mui/material/colors';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageFile extends File {
  preview: string;
}

interface ImagesDropzoneProps {
  name: string;
  // eslint-disable-next-line react/require-default-props
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagesDropzone = ({ name, onChange }: ImagesDropzoneProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUploadFiles, setHasUploadFiles] = useState(false);
  const [files, setFiles] = useState<ImageFile[]>([]);
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  const {
    getRootProps,
    fileRejections,
    isDragActive,
    isDragAccept,
    isDragReject,
    getInputProps,
  } = useDropzone({
    accept: 'image/jpeg,image/png',
    multiple: true,
    onDrop,
    maxFiles: 5,
  });

  const getBorderColor = () => {
    let borderColor = '#e0e0e0';
    if (isDragAccept) borderColor = green[500];
    if (isDragReject) borderColor = red[500];
    if (isDragActive) borderColor = theme.palette.primary.main;
    return borderColor;
  };

  useEffect(() => {
    setHasUploadFiles(files.length > 0);
  }, [files]);

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  useEffect(() => {
    if (fileRejections.length > 0) setIsOpen(true);
  }, [fileRejections]);

  return (
    <>
      {isOpen && fileRejections.length > 0 && (
        <Alert
          severity="error"
          sx={{ marginBottom: 2 }}
          onClose={() => setIsOpen(false)}
        >
          {fileRejections[0].errors[0].message}
        </Alert>
      )}
      <Box>
        <Grid
          container
          spacing={2}
          justifyContent={hasUploadFiles ? 'flex-start' : 'center'}
          alignItems={hasUploadFiles ? 'flex-start' : 'center'}
          flexDirection={hasUploadFiles ? 'row' : 'column'}
          flex={1}
          margin={0}
          sx={{
            textAlign: 'center',
            width: '100%',
            padding: 2,
            borderWidth: 2,
            borderRadius: 2,
            borderColor: getBorderColor(),
            borderStyle: 'dashed',
            backgroundColor: '#fafafa',
            color: grey[600],
            outline: 'none',
            transition: 'border .24s ease-in-out',
            cursor: 'pointer',
          }}
          {...getRootProps({
            isdragactive: String(isDragActive),
            isdragaccept: String(isDragAccept),
            isdragreject: String(isDragReject),
            className: 'dropzone',
          })}
        >
          <input {...getInputProps({ name, onChange })} />
          {files.length > 0 ? (
            <>
              {files.map((file, index) => (
                <Grid item lg={2} md={3} sm={4} xs={6} key={file.name}>
                  <Stack
                    justifyContent="center"
                    spacing={1}
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      src={file.preview}
                      sx={{ width: 96, height: 96, objectFit: 'cover' }}
                    />
                    <Typography variant="caption" noWrap sx={{ width: '100%' }}>
                      {file.name}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </>
          ) : (
            <Grid item>
              <Box>
                <CloudUpload sx={{ height: 64, width: 64, color: grey[600] }} />
                <Typography
                  variant="subtitle1"
                  sx={{ width: 300, userSelect: 'none' }}
                >
                  Drag and drop images for face data file (Max 5 files).
                  <br />
                  Accepted files is .png, .jpg, .jpeg
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
};

export default ImagesDropzone;
