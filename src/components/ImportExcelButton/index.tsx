/* eslint-disable @typescript-eslint/no-misused-promises */
import { Close, FileUpload } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import CustomDropzone from 'components/CustomDropzone';
import SlideTransition from 'components/SlideTransition';
import SubjectExamineesDto from 'dtos/subjectExaminees.dto';
import { addExaminees } from 'features/subjectExaminee/subjectExamineeSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import { useSnackbar } from 'notistack';
import React, { useCallback, useState } from 'react';
import { FileError, useDropzone } from 'react-dropzone';
import XLSX from 'xlsx';

interface DropzoneDialogProps {
  isDialogOpen: boolean;
  handleClose: () => void;
}

const options: XLSX.Sheet2JSONOpts = {
  header: [
    'roleNumber',
    'memberCode',
    'lastName',
    'middleName',
    'firstName',
    'fullName',
    'email',
  ],
};

interface ExamineeProps {
  roleNumber: number;
  memberCode: string;
  lastName: string;
  middleName: string;
  firstName: string;
  fullName: string;
  email: string;
}

const DropzoneDialog = ({ isDialogOpen, handleClose }: DropzoneDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const handleValidation = ({ name, size, type }: File) => {
    const filenamePattern = /\w+_\w+_\w+/g;
    const isDuplicated = files.some(
      file => file.name === name && file.size === size && file.type === type,
    );
    if (isDuplicated)
      return {
        code: 'duplicated',
        message: `${name} already existed`,
      } as FileError;
    if (!filenamePattern.test(name))
      return {
        code: 'format',
        message: `${name} has invalid name format`,
      };
    return null;
  };

  const dropzone = useDropzone({
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    multiple: true,
    onDrop,
    noClick: true,
    validator: handleValidation,
  });
  const themes = useTheme();

  const handleProcessFiles = async () => {
    setIsLoading(true);
    const data: SubjectExamineesDto[] = [];
    files.forEach(async file => {
      const params = file.name.split(/_|\./g);
      const workbook = XLSX.read(await file.arrayBuffer());
      workbook.SheetNames.forEach(async sheet => {
        const rowObject: ExamineeProps[] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet],
          options,
        );
        // remove the header rows
        rowObject.shift();
        // get email column only
        const examineeList = rowObject.map(row => ({
          email: row.email,
        }));
        data.push({
          examineeList,
          semesterName: params[0],
          subjectCode: params[1],
        });
      });
      if (data.length > 0) {
        try {
          const result = await dispatch(addExaminees(data));
          unwrapResult(result);
          showSuccessMessage(`Import ${files.length} file(s) successfully`);
          setFiles([]);
          handleClose();
        } catch (error) {
          setIsLoading(false);
          showErrorMessage(error);
        }
      }
    });
    setIsLoading(false);
  };

  const handleRemoveFile = (removedIndex: number) => {
    setFiles(files.filter((file, index) => index !== removedIndex));
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleClose}
      fullWidth
      TransitionComponent={SlideTransition}
    >
      <DialogTitle>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton sx={{ visibility: 'hidden' }} />
          <Typography variant="h6">Import subject’s examinees</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box pb={2}>
        <DialogContent sx={{ paddingTop: 0 }}>
          <Typography
            component="div"
            sx={{ fontWeight: 'bold', marginBottom: 2 }}
          >
            Before you upload:
            <Typography display="inline">
              {' '}
              Please upload spreadsheet files and the file must be named with
              the following patterns:
              {` <semester name>_<subject code>_<class code>`}
            </Typography>
            <Typography component="div" sx={{ marginTop: 1 }}>
              Example:{' '}
              <Typography
                display="inline"
                sx={{ color: themes.palette.primary.main }}
              >
                FALL2021_PRF192_SE1407.xsl
              </Typography>
            </Typography>
          </Typography>
          <CustomDropzone
            {...dropzone}
            acceptedFiles={files}
            handleRemoveFile={handleRemoveFile}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            variant="contained"
            loading={isLoading}
            sx={{ width: 200 }}
            onClick={handleProcessFiles}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const ImportExcelButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <DropzoneDialog
        isDialogOpen={isOpen}
        handleClose={() => setIsOpen(false)}
      />
      <Button
        sx={{
          backgroundColor: '#47B881',
          ':hover': { backgroundColor: '#43af7b' },
        }}
        variant="contained"
        onClick={() => setIsOpen(true)}
        startIcon={<FileUpload />}
      >
        Import examinees
      </Button>
    </>
  );
};

export default ImportExcelButton;
