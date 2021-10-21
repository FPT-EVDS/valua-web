import { Edit, EditOff } from '@mui/icons-material';
import { DateTimePicker, LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/hooks';
import RoomDropdown from 'components/RoomDropdown';
import SemesterDropdown from 'components/SemesterDropdown';
import StaffDropdown from 'components/StaffDropdown';
import SubjectDropdown from 'components/SubjectDropdown';
import { add } from 'date-fns';
import ShiftDto from 'dtos/shift.dto';
import { addShift, updateShift } from 'features/shift/detailShiftSlice';
import { useFormik } from 'formik';
import useQuery from 'hooks/useQuery';
import Account from 'models/account.model';
import Room from 'models/room.model';
import Semester from 'models/semester.model';
import Shift from 'models/shift.model';
import Subject from 'models/subject.model';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  shift: Shift | null;
  isLoading: boolean;
  isUpdate: boolean;
}

const ShiftDetailCard = ({ shift, isLoading, isUpdate }: Props) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const query = useQuery();
  const [isEditable, setIsEditable] = useState(
    String(query.get('edit')) === 'true' || !isUpdate,
  );
  // const initialValues: ShiftDto = shift || {
  //   beginTime: new Date(),
  //   finishTime: add(new Date(), { minutes: 90 }),
  //   description: '',
  //   examRoom: null,
  //   semester: null,
  //   shiftId: null,
  //   staff: null,
  //   subject: null,
  // };
  // const formik = useFormik({
  //   initialValues,
  //   onSubmit: async (payload: ShiftDto) => {
  //     try {
  //       const result =
  //         isUpdate === false
  //           ? await dispatch(addShift(payload))
  //           : await dispatch(updateShift(payload));
  //       const { shiftId } = unwrapResult(result);
  //       if (!isUpdate) {
  //         enqueueSnackbar('Create shift success', {
  //           variant: 'success',
  //           preventDuplicate: true,
  //         });
  //         setIsEditable(false);
  //         history.push(`/shift-manager/shift/${shiftId}`);
  //       } else {
  //         enqueueSnackbar('Update shift success', {
  //           variant: 'success',
  //           preventDuplicate: true,
  //         });
  //       }
  //     } catch (error) {
  //       enqueueSnackbar(error, {
  //         variant: 'error',
  //         preventDuplicate: true,
  //       });
  //     }
  //   },
  // });

  // const handleChangeBeginTime = async (selectedDate: Date | null) => {
  //   await formik.setFieldValue('beginTime', selectedDate);
  // };

  // const handleChangeFinishTime = async (selectedDate: Date | null) => {
  //   await formik.setFieldValue('finishTime', selectedDate);
  // };

  // const handleChangeSubject = async (subject: Subject | null) => {
  //   await formik.setFieldValue('subject', subject);
  // };

  // const handleChangeExamRoom = async (examRoom: Room | null) => {
  //   await formik.setFieldValue('examRoom', examRoom);
  // };

  // const handleChangeStaff = async (staff: Account | null) => {
  //   await formik.setFieldValue('staff', staff);
  // };

  // const handleChangeSemester = async (semester: Semester | null) => {
  //   await formik.setFieldValue('semester', semester);
  // };

  // const refreshFormValues = async () => {
  //   if (shift) {
  //     await formik.setValues(shift);
  //   }
  // };

  // useEffect(() => {
  //   refreshFormValues().catch(error =>
  //     enqueueSnackbar(error, {
  //       variant: 'error',
  //       preventDuplicate: true,
  //     }),
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [shift]);

  // return (
  //   <Card sx={{ minWidth: 275 }} elevation={2}>
  //     <CardHeader
  //       title={
  //         <Typography
  //           sx={{ fontWeight: 'medium', fontSize: 20 }}
  //           variant="h5"
  //           gutterBottom
  //         >
  //           {isUpdate ? 'Shift information' : 'New shift information'}
  //         </Typography>
  //       }
  //       action={
  //         shift?.isActive && (
  //           <IconButton onClick={() => setIsEditable(prevState => !prevState)}>
  //             {isEditable ? (
  //               <EditOff sx={{ fontSize: 20 }} />
  //             ) : (
  //               <Edit sx={{ fontSize: 20 }} />
  //             )}
  //           </IconButton>
  //         )
  //       }
  //     />
  //     <Box component="form" onSubmit={formik.handleSubmit}>
  //       <CardContent>
  //         <Grid container spacing={2}>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <SemesterDropdown
  //               value={formik.values?.semester}
  //               isEditable={isEditable}
  //               onChange={handleChangeSemester}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <SubjectDropdown
  //               value={formik.values.subject}
  //               isEditable={isEditable}
  //               onChange={handleChangeSubject}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <RoomDropdown
  //               value={formik.values.examRoom}
  //               isEditable={isEditable}
  //               onChange={handleChangeExamRoom}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <StaffDropdown
  //               value={formik.values.staff}
  //               isEditable={isEditable}
  //               onChange={handleChangeStaff}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <DateTimePicker
  //               label="Begin time"
  //               value={formik.values.beginTime}
  //               inputFormat="dd/MM/yyyy HH:mm"
  //               onChange={date => handleChangeBeginTime(date)}
  //               disabled={!isEditable}
  //               renderInput={params => (
  //                 <TextField
  //                   {...params}
  //                   name="beginTime"
  //                   autoFocus
  //                   margin="dense"
  //                   fullWidth
  //                   disabled={!isEditable}
  //                   variant="outlined"
  //                   InputLabelProps={{
  //                     shrink: true,
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12} md={6} lg={4}>
  //             <DateTimePicker
  //               label="End time"
  //               value={formik.values.finishTime}
  //               inputFormat="dd/MM/yyyy HH:mm"
  //               onChange={date => handleChangeFinishTime(date)}
  //               disabled={!isEditable}
  //               renderInput={params => (
  //                 <TextField
  //                   {...params}
  //                   name="finishTime"
  //                   autoFocus
  //                   margin="dense"
  //                   fullWidth
  //                   disabled={!isEditable}
  //                   variant="outlined"
  //                   InputLabelProps={{
  //                     shrink: true,
  //                   }}
  //                 />
  //               )}
  //             />
  //           </Grid>
  //           <Grid item xs={12}>
  //             <TextField
  //               name="description"
  //               autoFocus
  //               multiline
  //               margin="dense"
  //               label="Description"
  //               rows={4}
  //               value={formik.values.description}
  //               fullWidth
  //               variant="outlined"
  //               InputLabelProps={{
  //                 shrink: true,
  //               }}
  //               onChange={formik.handleChange}
  //             />
  //           </Grid>
  //         </Grid>
  //       </CardContent>
  //       <Divider />
  //       <CardActions>
  //         <LoadingButton
  //           disabled={!isEditable}
  //           loading={isLoading}
  //           type="submit"
  //           variant="contained"
  //           sx={{ width: 150 }}
  //         >
  //           {isUpdate ? 'Update shift' : 'Add shift'}
  //         </LoadingButton>
  //       </CardActions>
  //     </Box>
  //   </Card>
  // );
};

export default ShiftDetailCard;
