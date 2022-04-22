import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import DetailSubjectExamineeDto from 'dtos/detailSubjectExaminee';
import React from 'react';

interface Props {
  examineeSubject: DetailSubjectExamineeDto;
}

const ExamineeDetailCard = ({ examineeSubject }: Props) => (
  <Card sx={{ minWidth: 275 }} elevation={2}>
    <CardHeader
      title={
        <Typography
          sx={{ fontWeight: 'medium', fontSize: 16 }}
          variant="h5"
          gutterBottom
        >
          Subject&apos;s information
        </Typography>
      }
    />
    <Box>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Semester"
              fullWidth
              value={examineeSubject.subjectSemester.semester.semesterName}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Subject"
              fullWidth
              value={`${examineeSubject.subjectSemester.subject.subjectCode} - ${examineeSubject.subjectSemester.subject.subjectName}`}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Duration"
              fullWidth
              value={examineeSubject.subjectSemester.subject.duration}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">minutes</InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Box>
  </Card>
);

export default ExamineeDetailCard;
