import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import { GridActionsColDef, GridColDef } from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { removeAttendance } from 'features/examRoom/detailExamRoomSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import Account from 'models/account.model';
import Attendance from 'models/attendance.model';
import React, { useEffect, useState } from 'react';

interface Props {
  data: Attendance[];
  hideActions: boolean;
  // eslint-disable-next-line react/require-default-props
  onActionButtonClick?: () => void;
}

const transformAttendancesToRows = (attendances: Attendance[]) =>
  attendances.map(attendance => ({
    ...attendance,
    id: attendance.attendanceId,
  }));

const ExamSeatTable = ({ data, hideActions, onActionButtonClick }: Props) => {
  const DEFAULT_PAGE_SIZE = 10;
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const examRoom = useAppSelector(state => state.detailExamRoom.examRoom);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(transformAttendancesToRows(data));

  const handleRemoveExaminee = async (attendance: Attendance) => {
    if (examRoom) {
      try {
        const result = await dispatch(
          removeAttendance(attendance.attendanceId),
        );
        unwrapResult(result);
        setRows(prev =>
          prev.filter(item => item.attendanceId !== attendance.attendanceId),
        );
        showSuccessMessage(
          `${attendance.examinee.fullName} has been successfully removed`,
        );
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  useEffect(() => {
    setRows(transformAttendancesToRows(data));
  }, [data]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'attendanceId', hide: true },
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
      hide: hideActions,
      getActions: ({ row }) => {
        const attendance = row as Attendance;
        return rows.length > 1
          ? [
              <Button
                variant="text"
                onClick={() => handleRemoveExaminee(attendance)}
              >
                Remove
              </Button>,
            ]
          : [];
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
      title="Exam seat list"
      columns={columns}
      isLoading={false}
      rows={rows}
      addButton={!hideActions && <AddButton />}
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

export default ExamSeatTable;
