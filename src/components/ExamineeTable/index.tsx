/* eslint-disable react/require-default-props */
import { Add, Info } from '@mui/icons-material';
import { Button, useTheme } from '@mui/material';
import { GridActionsColDef, GridColDef } from '@mui/x-data-grid';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import CustomTooltip from 'components/CustomTooltip';
import EVDSDataGrid from 'components/EVDSDataGrid';
import { addRemovedExaminee } from 'features/examRoom/addExamRoomSlice';
import Room from 'models/room.model';
import SubjectExaminee from 'models/subjectExaminee.model';
import React, { useEffect, useState } from 'react';

interface Props {
  room: Room;
  data: Array<{
    attendanceId: string | null;
    subjectExaminee: SubjectExaminee;
    position: number;
    startTime: Date | null;
    finishTime: Date | null;
  }>;
  onActionButtonClick?: () => void;
}

const transformAttendancesToRows = (
  attendances: Array<{
    attendanceId: string | null;
    subjectExaminee: SubjectExaminee;
    position: number;
    startTime: Date | null;
    finishTime: Date | null;
  }>,
) =>
  attendances.map((attendance, index) => ({
    ...attendance,
    index,
    id: attendance.subjectExaminee.subjectExamineeId,
  }));

const ExamineeTable = ({ room, data, onActionButtonClick }: Props) => {
  const DEFAULT_PAGE_SIZE = 10;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(transformAttendancesToRows(data));
  const [search, setSearch] = useState('');
  const { removedExaminees } = useAppSelector(state => state.addExamRoom);

  const handleRemoveExaminee = (examinee: SubjectExaminee) => {
    dispatch(addRemovedExaminee({ examinee, roomId: room.roomId }));
    setRows(prev =>
      prev.filter(
        item =>
          item.subjectExaminee.subjectExamineeId !== examinee.subjectExamineeId,
      ),
    );
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
      ({
        subjectExaminee: {
          examinee: { companyId, fullName, email },
        },
      }) =>
        companyId.toLowerCase().includes(searchValue) ||
        fullName.toLowerCase().includes(searchValue) ||
        email.includes(searchValue),
    );
    setRows(filteredValues);
  }, [search]);

  const columns: Array<GridColDef | GridActionsColDef> = [
    { field: 'subjectExaminee', hide: true },
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
        if (room.lastPosition) {
          return parseInt(String(room.lastPosition), 10) + index + 1;
        }
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
        const account = api.getCellValue(
          id,
          'subjectExaminee',
        ) as SubjectExaminee;
        return account.examinee.companyId;
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
        const account = api.getCellValue(
          id,
          'subjectExaminee',
        ) as SubjectExaminee;
        return account.examinee.fullName;
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.1,
      minWidth: 130,
      type: 'actions',
      getActions: ({ row }) => {
        const examinee = row.subjectExaminee as SubjectExaminee;
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

  const generateAlert = () => {
    let currentRoomSize = rows.length;
    let title = '';
    if (room.lastPosition) {
      currentRoomSize += parseInt(String(room.lastPosition), 10) + 1;
    }
    if (room.seatCount < currentRoomSize) {
      title += `- Recommend room size is ${room.seatCount} \n`;
    }
    if (removedExaminees.length > 0) {
      title += `- There are ${removedExaminees.length} examinee(s) left unassigned`;
    }
    return (
      (room.seatCount < currentRoomSize || removedExaminees.length > 0) && (
        <CustomTooltip
          sx={{ mt: 0.75 }}
          title={<span style={{ whiteSpace: 'pre-line' }}>{title}</span>}
          color={theme.palette.warning.main}
        >
          <Info color="warning" />
        </CustomTooltip>
      )
    );
  };

  return (
    <EVDSDataGrid
      title={room.roomName}
      leftActions={generateAlert()}
      columns={columns}
      isLoading={false}
      hasSearch
      handleSearch={handleSearch}
      rows={rows}
      addButton={<AddButton />}
      pagination
      rowsPerPageOptions={[DEFAULT_PAGE_SIZE]}
      pageSize={DEFAULT_PAGE_SIZE}
      rowCount={rows.length}
      page={page}
      onPageChange={newPage => setPage(newPage)}
    />
  );
};

export default ExamineeTable;
