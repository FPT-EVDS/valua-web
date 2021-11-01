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
import React, { useState } from 'react';
import { VoidExpression } from 'typescript';

interface Props {
  // eslint-disable-next-line react/require-default-props
  data: Pick<Room, 'roomId' | 'seatCount' | 'roomName' | 'floor' | 'status'>[];
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
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row, index) => (
            <TableRow key={row.roomId}>
              <TableCell component="th" scope="row" align="center">
                <Radio
                  checked={selectedIndex === index}
                  onChange={() => handleSelect(index)}
                  value={index}
                />
              </TableCell>
              <TableCell align="center">{row.roomName}</TableCell>
              <TableCell align="center">
                {selectedIndex === index && (
                  <Button variant="text" onClick={handleCreateExamRoom}>
                    Create
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 30 * emptyRows }}>
              <TableCell colSpan={3} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[3]}
              colSpan={3}
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
