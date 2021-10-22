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
import CustomDropzone from 'components/CustomDropzone';
import SlideTransition from 'components/SlideTransition';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
  const dropzone = useDropzone({
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    multiple: true,
  });
  const themes = useTheme();

  const handleProcessFiles = () => {
    const files = dropzone.acceptedFiles;
    const data: unknown[] = [];
    files.forEach(async file => {
      const workbook = XLSX.read(await file.arrayBuffer());
      workbook.SheetNames.forEach(sheet => {
        const rowObject: ExamineeProps[] = XLSX.utils.sheet_to_json(
          workbook.Sheets[sheet],
          options,
        );
        // remove the header rows
        rowObject.shift();
        // get email column only
        const emails = rowObject.map(row => ({
          email: row.email,
        }));
        data.push(...emails);
      });
    });
    console.log(data);
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
          <CustomDropzone {...dropzone} />
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <LoadingButton
            variant="contained"
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
