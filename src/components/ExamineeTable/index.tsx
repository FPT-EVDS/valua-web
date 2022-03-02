/* eslint-disable react/require-default-props */
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { GridActionsColDef, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { updateRemovedExaminees } from 'features/examRoom/addExamRoomSlice';
import Account from 'models/account.model';
import Examinee from 'models/examinee.model';
import React, { useEffect, useState } from 'react';

interface Props {
  data: Examinee[];
  title: string;
  leftActions?: React.ReactNode;
  onActionButtonClick?: () => void;
}

const transformAttendancesToRows = (examinees: Examinee[]) =>
  examinees.map((examinee, index) => ({
    ...examinee,
    index,
    id: examinee.subjectExamineeID,
  }));

const ExamineeTable = ({
  title,
  data,
  leftActions,
  onActionButtonClick,
}: Props) => {
  const DEFAULT_PAGE_SIZE = 10;
  const removedItems = useAppSelector(
    state => state.addExamRoom.removedExaminees,
  );
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(transformAttendancesToRows(data));

  const handleRemoveExaminee = (examinee: Examinee) => {
    dispatch(updateRemovedExaminees([...removedItems, examinee]));
    setRows(prev =>
      prev.filter(
        item => item.subjectExamineeID !== examinee.subjectExamineeID,
      ),
    );
  };

  useEffect(() => {
    setRows(transformAttendancesToRows(data));
  }, [data]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'subjectExamineeID', hide: true },
    { field: 'examinee', hide: true },
    { field: 'index', hide: true },
    {
      field: 'position',
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      headerName: 'Pos',
      minWidth: 30,
      valueFormatter: ({ api, id }) => {
        const index = parseInt(api.getCellValue(id, 'index'), 10);
        return index + 1;
      },
    },
    {
      field: 'companyId',
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      headerName: 'Student code',
      minWidth: 100,
      flex: 0.1,
      valueFormatter: ({ api, id }) => {
        const account = api.getCellValue(id, 'examinee') as Account;
        return account.companyId;
      },
    },
    {
      field: 'fullName',
      sortable: false,
      filterable: false,
      headerName: 'Name',
      headerAlign: 'center',
      align: 'center',
      minWidth: 180,
      flex: 0.1,
      valueFormatter: ({ api, id }) => {
        const account = api.getCellValue(id, 'examinee') as Account;
        return account.fullName;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      minWidth: 130,
      type: 'actions',
      getActions: ({ row }) => {
        const examinee = row as Examinee;
        return [
          <Button variant="text" onClick={() => handleRemoveExaminee(examinee)}>
            Remove
          </Button>,
        ];
      },
    },
  ];

  const AddButton = () => (
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={onActionButtonClick}
    >
      Add examinee
    </Button>
  );

  return (
    <EVDSDataGrid
      title={title}
      columns={columns}
      isLoading={false}
      leftActions={leftActions}
      rows={rows}
      addButton={<AddButton />}
      pagination
      hasSearch={false}
      rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
      pageSize={DEFAULT_PAGE_SIZE}
      rowCount={data.length}
      page={page}
      onPageChange={newPage => setPage(newPage)}
    />
  );
};

export default ExamineeTable;
