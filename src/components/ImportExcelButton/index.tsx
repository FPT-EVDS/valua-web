/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  Check,
  ChevronLeft,
  Close,
  Download,
  FileUpload,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Step,
  StepButton,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import CustomDropzone from 'components/CustomDropzone';
import SlideTransition from 'components/SlideTransition';
import ImportExcelDto from 'dtos/importExcel.dto';
import { importExaminees } from 'features/subjectExaminee/subjectExamineeSlice';
import saveAs from 'file-saver';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React, { useCallback, useState } from 'react';
import { FileError, useDropzone } from 'react-dropzone';
import subjectExamineesServices from 'services/subjectExaminees.service';

interface DropzoneDialogProps {
  isDialogOpen: boolean;
  handleClose: () => void;
}

const steps = ['Import files', 'Result'];

const DropzoneDialog = ({ isDialogOpen, handleClose }: DropzoneDialogProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [alertOpen, setAlertOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [importResults, setImportResults] = useState<ImportExcelDto[]>([]);
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();

  const isLastStep = () => activeStep === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep()) setActiveStep(activeStep + 1);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

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
    accept: `.csv, .xls, .xlsx, text/csv, application/csv,
      text/comma-separated-values, application/csv, application/excel,
      application/vnd.msexcel, text/anytext, application/vnd. ms-excel,
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
    multiple: true,
    onDrop,
    noClick: true,
    validator: handleValidation,
  });

  const handleProcessFiles = async () => {
    if (files.length > 0) {
      setIsLoading(true);
      const formData = new FormData();
      files.forEach(file => formData.append('importFiles', file));
      try {
        const result = await dispatch(importExaminees(formData));
        const data = unwrapResult(result);
        showSuccessMessage('Import successfully');
        setImportResults(data);
        setFiles([]);
        handleNext();
      } catch (error) {
        setIsLoading(false);
        showErrorMessage(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleRemoveFile = (removedIndex: number) => {
    setFiles(files.filter((file, index) => index !== removedIndex));
  };

  const resetModal = () => {
    setActiveStep(0);
    setImportResults([]);
    setFiles([]);
  };

  const deleteImportFiles = async () => {
    const fileNames: string[] = importResults
      .filter(result => result.fileUrl)
      .map(item => String(item.fileName));
    if (fileNames.length > 0) {
      try {
        await subjectExamineesServices.deleteFailedImportFile(fileNames);
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  const handleCloseModal = async () => {
    resetModal();
    await deleteImportFiles();
    handleClose();
  };

  const handleDownloadFile = async (payload: ImportExcelDto) => {
    const { fileUrl, fileName } = payload;
    if (fileUrl) {
      try {
        const response =
          await subjectExamineesServices.downloadFailedImportFile(fileUrl);
        saveAs(response.data, fileName);
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCloseModal}
      fullWidth
      maxWidth={activeStep === 0 ? 'sm' : 'md'}
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
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <IconButton onClick={handleCloseModal}>
            <Close />
          </IconButton>
        </Grid>
      </DialogTitle>
      <Box pb={2}>
        <DialogContent sx={{ paddingTop: 0 }}>
          {activeStep === 0 ? (
            <>
              {alertOpen && (
                <Alert
                  severity="info"
                  sx={{ mb: 2 }}
                  onClose={handleCloseAlert}
                >
                  <AlertTitle>Before you upload:</AlertTitle>
                  Please upload spreadsheet files and the file must be named
                  with the following patterns:
                  {` <semester name>_<subject code>_<class code> \n`}
                  <Box mt={1}>
                    Example: <b>FALL2021_PRF192_SE1407.xsl</b>
                  </Box>
                </Alert>
              )}
              <CustomDropzone
                {...dropzone}
                acceptedFiles={files}
                handleRemoveFile={handleRemoveFile}
              />
            </>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>File name</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell align="center">Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {importResults.map((row, index) => (
                    <TableRow key={row.fileName}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{row.fileName}</TableCell>
                      <TableCell align="center">
                        {row.fileUrl || row.result.includes('Error') ? (
                          <Close color="error" />
                        ) : (
                          <Check color="success" />
                        )}
                      </TableCell>
                      <TableCell>{row.result}</TableCell>
                      <TableCell align="center">
                        {row.fileUrl && (
                          <IconButton
                            color="primary"
                            onClick={async () => {
                              await handleDownloadFile(row);
                            }}
                          >
                            <Download />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          {activeStep === 0 ? (
            <LoadingButton
              variant="contained"
              loading={isLoading}
              sx={{ width: 200 }}
              onClick={handleProcessFiles}
            >
              Submit
            </LoadingButton>
          ) : (
            <Button
              variant="contained"
              startIcon={<ChevronLeft />}
              onClick={resetModal}
            >
              Back to import screen
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

const ImportExcelButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <DropzoneDialog
          isDialogOpen={isOpen}
          handleClose={() => setIsOpen(false)}
        />
      )}
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
