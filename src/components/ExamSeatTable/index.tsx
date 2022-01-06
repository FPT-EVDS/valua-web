import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { removeExamSeat } from 'features/examRoom/detailExamRoomSlice';
import useCustomSnackbar from 'hooks/useCustomSnackbar';
import ExamSeat from 'models/examSeat.model';
import React, { useEffect, useState } from 'react';

interface Props {
  data: ExamSeat[];
}

const ExamSeatTable = ({ data }: Props) => {
  const dispatch = useAppDispatch();
  const { showErrorMessage, showSuccessMessage } = useCustomSnackbar();
  const examRoom = useAppSelector(state => state.detailExamRoom.examRoom);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(data);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - rows.length)
      : Math.max(0, rowsPerPage - data.length);

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

  const handleRemoveExaminee = async (examinee: ExamSeat, index: number) => {
    if (examRoom) {
      try {
        const result = await dispatch(
          removeExamSeat({
            examSeatId: examinee.examSeatId,
            examinee: { appUserId: examinee.examinee.appUserId },
            examRoom: { examRoomID: examRoom.examRoomID },
          }),
        );
        unwrapResult(result);
        setRows(prev => prev.filter((item, itemIndex) => index !== itemIndex));
        showSuccessMessage(
          `${examinee.examinee.fullName} has been successfully removed`,
        );
      } catch (error) {
        showErrorMessage(error);
      }
    }
  };

  useEffect(() => {
    setRows(data);
  }, [data]);

  return (
    <TableContainer component={Paper} sx={{ display: 'flex', height: '100%' }}>
      <Table sx={{ flexGrow: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Position</TableCell>
            <TableCell align="center">Examinee name</TableCell>
            <TableCell align="center">Student code</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row, index) => (
            <TableRow key={row.examSeatId}>
              <TableCell component="th" scope="row" align="center">
                {row.position}
              </TableCell>
              <TableCell align="center">{row.examinee.fullName}</TableCell>
              <TableCell align="center">{row.examinee.companyId}</TableCell>
              <TableCell align="center">
                {rows.length > 1 && (
                  <Button
                    variant="text"
                    onClick={() => handleRemoveExaminee(row, index)}
                  >
                    Remove
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 60 * emptyRows }}>
              <TableCell colSpan={4} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              colSpan={4}
              count={rows.length}
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

export default ExamSeatTable;
