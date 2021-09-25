/* eslint-disable prefer-destructuring */
import { Add, Delete, Edit } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import {
  GridActionsCellItem,
  GridActionsColDef,
  GridColDef,
  GridRowModel,
  GridRowParams,
} from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import ConfirmDialog, { ConfirmDialogProps } from 'components/ConfirmDialog';
import EVDSDataGrid from 'components/EVDSDataGrid';
import SubjectDetailDialog from 'components/SubjectDetailDialog';
import SubjectDto from 'dtos/subject.dto';
import { disableSubject, getSubjects } from 'features/subject/subjectsSlice';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

const SubjectPage = () => {
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [confirmDialogProps, setConfirmDialogProps] =
    useState<ConfirmDialogProps>({
      title: `Do you want to delete this subject ?`,
      content: "This action can't be revert",
      open: false,
      handleClose: () =>
        setConfirmDialogProps(prevState => ({ ...prevState, open: false })),
      handleAccept: () => null,
    });
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const {
    isLoading,
    current: { subjects },
  } = useAppSelector(state => state.subjects);
  const rows: GridRowModel[] = subjects.map(subject => ({
    ...subject,
    id: subject.subjectId,
  }));
  const [initialValues, setInitialValues] = useState<SubjectDto>({
    subjectId: null,
    subjectCode: '',
    subjectName: '',
  });

  const fetchSubjects = async (numOfPage: number) => {
    const actionResult = await dispatch(getSubjects(numOfPage));
    unwrapResult(actionResult);
  };

  useEffect(() => {
    fetchSubjects(0).catch(error =>
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [subjects]);

  const handleDeleteSubject = async (subject: string) => {
    try {
      const result = await dispatch(disableSubject(subject));
      unwrapResult(result);
      enqueueSnackbar('Disable subject success', {
        variant: 'success',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    } catch (error) {
      enqueueSnackbar(error, {
        variant: 'error',
        preventDuplicate: true,
      });
      setConfirmDialogProps(prevState => ({
        ...prevState,
        open: false,
      }));
    }
  };

  const showDeleteConfirmation = ({ getValue, id }: GridRowParams) => {
    const subjectId = String(getValue(id, 'subjectId'));
    const name = String(getValue(id, 'subjectName'));
    setConfirmDialogProps(prevState => ({
      ...prevState,
      open: true,
      title: `Do you want to remove subject ${name}`,
      handleAccept: () => handleDeleteSubject(subjectId),
    }));
  };

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'subjectId', hide: true },
    {
      field: 'subjectCode',
      headerName: 'Subject Code',
      flex: 0.1,
      minWidth: 130,
    },
    { field: 'subjectName', headerName: 'Name', flex: 0.1, minWidth: 130 },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.1,
      minWidth: 130,
      renderCell: ({ id, field, getValue }) => {
        const isActive = getValue(id, field);
        return (
          <Typography
            variant="subtitle1"
            color={isActive ? green[500] : red[500]}
          >
            {isActive ? 'Active' : 'Disable'}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      getActions: params => {
        const isActive = params.getValue(params.id, 'isActive');
        const deleteItems = [
          <GridActionsCellItem
            label="Delete"
            icon={<Delete />}
            showInMenu
            onClick={() => showDeleteConfirmation(params)}
          />,
          <GridActionsCellItem
            label="Edit"
            icon={<Edit />}
            showInMenu
            onClick={() => {
              setIsUpdate(true);
              setInitialValues(params.row as SubjectDto);
              setOpen(true);
            }}
          />,
        ];
        if (!isActive) deleteItems.shift();
        return deleteItems;
      },
    },
  ];

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={() => {
        setOpen(true);
        setIsUpdate(false);
      }}
    >
      Add subject
    </Button>
  );

  return (
    <div>
      <ConfirmDialog {...confirmDialogProps} />
      <SubjectDetailDialog
        open={open}
        handleClose={() => setOpen(false)}
        isUpdate={isUpdate}
        initialValues={initialValues}
      />
      <EVDSDataGrid
        isLoading={isLoading}
        title="Manage Subjects"
        columns={columns}
        rows={rows}
        addButton={<AddButton />}
        hasFilter={false}
      />
    </div>
  );
};

export default SubjectPage;
