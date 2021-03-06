import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ImagesDropzone from 'components/ImagesDropzone';
import { updateAccountEmbedding } from 'features/account/detailAccountSlice';
import { useFormik } from 'formik';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import React from 'react';

interface Props {
  // eslint-disable-next-line react/require-default-props
  onSubmitSuccess?: () => void;
}

const AccountEmbeddingCard = ({ onSubmitSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { showSuccessMessage, showErrorMessage } = useCustomSnackbar();
  const { account, isLoading } = useAppSelector(state => state.detailAccount);
  const formik = useFormik({
    initialValues: {
      imageFiles: null as File[] | null,
    },
    onSubmit: async () => {
      if (account) {
        try {
          const { appUserId } = account;
          const { imageFiles } = formik.values;
          const formData = new FormData();
          if (imageFiles) {
            // eslint-disable-next-line unicorn/no-for-loop
            for (let i = 0; i < imageFiles.length; i += 1) {
              formData.append('imageFiles', imageFiles[i]);
            }
          }
          const result = await dispatch(
            updateAccountEmbedding({ appUserId, formData }),
          );
          const message = unwrapResult(result);
          showSuccessMessage(message);
          formik.resetForm();
          if (onSubmitSuccess) {
            onSubmitSuccess();
          }
        } catch (error) {
          showErrorMessage(error);
        }
      }
    },
  });

  const handleUploadFileList = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const imageFiles: File[] = [];
      for (let i = 0; i < event.target.files.length; i += 1) {
        imageFiles.push(event.target.files[i]);
      }
      await formik.setFieldValue('imageFiles', imageFiles);
    }
  };

  const handleDropFiles = async (imageFiles: File[]) => {
    await formik.setFieldValue('imageFiles', imageFiles);
  };

  return (
    <Card sx={{ minWidth: 275 }} elevation={2}>
      <CardHeader
        title={
          <Typography
            sx={{ fontWeight: 'medium', fontSize: 20 }}
            variant="h5"
            gutterBottom
          >
            Embed images here
          </Typography>
        }
      />
      <CardContent>
        <ImagesDropzone
          name="imageFiles"
          onChange={handleUploadFileList}
          handleDropFiles={handleDropFiles}
        />
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between' }}>
        <Box
          component="form"
          encType="multipart/form-data"
          noValidate
          onSubmit={formik.handleSubmit}
          pb={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%' }}
        >
          <>
            {!isLoading ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Button type="submit" disabled={!formik.values.imageFiles}>
                  Embed
                </Button>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <CircularProgress />
              </Box>
            )}
          </>
        </Box>
      </CardActions>
    </Card>
  );
};

export default AccountEmbeddingCard;
