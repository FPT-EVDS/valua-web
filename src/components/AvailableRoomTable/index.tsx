import {
  Button,
  Paper,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import Room from 'models/room.model';
import SubjectExaminee from 'models/subjectExaminee.model';
import React, { useState } from 'react';

interface Props {
  data: {
    room: Room;
    attendances: {
      attendanceId: string | null;
      subjectExaminee: SubjectExaminee;
      position: number;
      startTime: Date | null;
      finishTime: Date | null;
    }[];
  }[];
  selectedIndex: number;
  handleCreateExamRoom: () => void;
  handleSelect: (index: number) => void;
}

const AvailableRoomTable = ({
  data,
  handleSelect,
  selectedIndex,
  handleCreateExamRoom,
}: Props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Select</TableCell>
            <TableCell align="center">Room name</TableCell>
            <TableCell align="center">Seat count</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <TableRow key={row.room.roomId}>
              <TableCell component="th" scope="row" align="center">
                <Radio
                  checked={selectedIndex === index + page * rowsPerPage}
                  onChange={() => handleSelect(index + page * rowsPerPage)}
                  value={index}
                />
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: row.room.lastPosition ? 'bold' : 400 }}
              >
                {row.room.roomName}
              </TableCell>
              <TableCell align="center">{row.room.seatCount}</TableCell>
              <TableCell align="center">
                {selectedIndex === index &&
                  data[selectedIndex].attendances.length > 0 && (
                    <Button variant="text" onClick={handleCreateExamRoom}>
                      Create
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 30 * emptyRows }}>
              <TableCell colSpan={4} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[3]}
              colSpan={4}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default AvailableRoomTable;
