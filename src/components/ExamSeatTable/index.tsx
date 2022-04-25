/* eslint-disable prefer-destructuring */
import { Add, FiberManualRecord } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { green, indigo, red } from '@mui/material/colors';
import { GridActionsColDef, GridColDef } from '@mui/x-data-grid';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import EVDSDataGrid from 'components/EVDSDataGrid';
import ShiftStatus from 'enums/shiftStatus.enum';
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
    ...attendance.subjectExaminee,
    startTime: attendance.startTime,
    finishTime: attendance.finishTime,
    position: attendance.position,
    id: attendance.attendanceId,
  }));

const ExamSeatTable = ({ data, hideActions, onActionButtonClick }: Props) => {
  const DEFAULT_PAGE_SIZE = 10;
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const { examRoom, shift } = useAppSelector(state => state.detailExamRoom);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(transformAttendancesToRows(data));
  const [search, setSearch] = useState('');

  const handleRemoveExaminee = async (attendanceId: string) => {
    if (examRoom) {
      try {
        const result = await dispatch(removeAttendance(attendanceId));
        unwrapResult(result);
        setRows(prev => prev.filter(item => item.id !== attendanceId));
        showSuccessMessage(`Examinee has been successfully removed`);
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  const handleSearch = (searchValue: string) => {
    setSearch(searchValue);
  };

  useEffect(() => {
    setRows(transformAttendancesToRows(data));
  }, [data]);

  useEffect(() => {
    const attendances = transformAttendancesToRows(data);
    const searchValue = search.toLowerCase();
    const filteredValues = attendances.filter(
      ({ examinee: { companyId, fullName, email } }) =>
        companyId.toLowerCase().includes(searchValue) ||
        fullName.toLowerCase().includes(searchValue) ||
        email.includes(searchValue),
    );
    setRows(filteredValues);
  }, [search]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'attendanceId', hide: true },
    { field: 'examinee', hide: true },
    { field: 'finishTime', hide: true },
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
      field: 'startTime',
      headerName: 'Status',
      flex: 0.1,
      hide: shift?.status !== ShiftStatus.Finished,
      minWidth: 130,
      renderCell: ({ getValue, id }) => {
        const startTime = getValue(id, 'startTime');
        const finishTime = getValue(id, 'finishTime');
        const status = startTime ? (finishTime ? 2 : 1) : 0;
        let message = 'Unattended';
        let color: string = red[500];
        switch (status) {
          case 1:
            color = green[500];
            message = 'Attendend';
            break;

          case 2:
            color = indigo[500];
            message = 'Finished';
            break;

          default:
            break;
        }
        return (
          <Box display="flex" alignItems="center">
            <FiberManualRecord sx={{ fontSize: 14, marginRight: 1, color }} />
            <Typography variant="subtitle1" color={color}>
              {message}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      minWidth: 130,
      type: 'actions',
      hide: hideActions,
      getActions: ({ id }) =>
        rows.length > 1
          ? [
              <Button
                variant="text"
                onClick={() => handleRemoveExaminee(String(id))}
              >
                Unassign
              </Button>,
            ]
          : [],
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
      hasSearch
      handleSearch={handleSearch}
      rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
      pageSize={DEFAULT_PAGE_SIZE}
      rowCount={rows.length}
      page={page}
      onPageChange={newPage => setPage(newPage)}
    />
  );
};

export default ExamSeatTable;
