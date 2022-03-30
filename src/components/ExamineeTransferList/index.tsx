import { Close, Search } from '@mui/icons-material';
import { IconButton, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAppSelector } from 'app/hooks';
import SubjectExaminee from 'models/subjectExaminee.model';
import React, { useEffect, useState } from 'react';

interface Props {
  selectedIndex: number;
  roomName: string;
  handleSelected: (examinee: SubjectExaminee[]) => void;
}

interface TransferListProps {
  title: React.ReactNode;
  items: SubjectExaminee[];
}

function not(a: SubjectExaminee[], b: SubjectExaminee[]) {
  return a.filter(value => !b.includes(value));
}

function intersection(a: SubjectExaminee[], b: SubjectExaminee[]) {
  return a.filter(value => b.includes(value));
}

function union(a: SubjectExaminee[], b: SubjectExaminee[]) {
  return [...a, ...not(b, a)];
}

const ExamineeTransferList = ({
  selectedIndex,
  roomName,
  handleSelected,
}: Props) => {
  const { removedExaminees, examRooms } = useAppSelector(
    state => state.addExamRoom,
  );
  const [checked, setChecked] = useState<SubjectExaminee[]>([]);
  const [left, setLeft] = useState<SubjectExaminee[]>([]);
  const [right, setRight] = useState<SubjectExaminee[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (examRooms) {
      const examinees = examRooms.examRooms[selectedIndex].attendances.map(
        attendance => attendance.subjectExaminee,
      );
      setRight(examinees);
      handleSelected(examinees);
    }
    setLeft(removedExaminees);
    setChecked([]);
  }, [examRooms, selectedIndex]);

  const handleToggle = (value: SubjectExaminee) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: SubjectExaminee[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: SubjectExaminee[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight([...right, ...leftChecked]);
    handleSelected([...right, ...leftChecked]);
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft([...left, ...rightChecked]);
    setRight(not(right, rightChecked));
    handleSelected(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const TransferList = ({ items, title }: TransferListProps) => {
    const [isSearch, setIsSearch] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState('');
    const [filteredItems, setFilteredItems] =
      useState<SubjectExaminee[]>(items);

    const handleIsSearch = () => {
      setIsSearch(prev => !prev);
    };

    useEffect(() => {
      const search = searchValue.toLowerCase();
      const searchList = items.filter(
        ({ examinee: { companyId, email, fullName } }) =>
          companyId.toLowerCase().includes(search) ||
          email.toLowerCase().includes(search) ||
          fullName.toLowerCase().includes(search),
      );
      setFilteredItems(searchList);
    }, [searchValue]);

    return (
      <>
        <Card>
          <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
              !isSearch && (
                <Checkbox
                  onClick={handleToggleAll(items)}
                  checked={
                    numberOfChecked(items) === items.length && items.length > 0
                  }
                  indeterminate={
                    numberOfChecked(items) !== items.length &&
                    numberOfChecked(items) !== 0
                  }
                  disabled={items.length === 0}
                  inputProps={{
                    'aria-label': 'all items selected',
                  }}
                />
              )
            }
            title={
              isSearch ? (
                <TextField
                  margin="dense"
                  size="small"
                  fullWidth
                  value={searchValue}
                  variant="standard"
                  placeholder="Search here..."
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={event => setSearchValue(event.target.value)}
                />
              ) : (
                title
              )
            }
            subheader={
              !isSearch && `${numberOfChecked(items)}/${items.length} selected`
            }
            action={
              <IconButton onClick={handleIsSearch}>
                {isSearch ? <Close /> : <Search />}
              </IconButton>
            }
          />
          <Divider />
          <List
            sx={{
              height: 230,
              bgcolor: 'background.paper',
              overflow: 'auto',
            }}
            dense
            component="div"
            role="list"
          >
            {filteredItems.map(value => {
              const labelId = `transfer-list-all-item-${value.subjectExamineeId}-label`;

              return (
                <ListItem
                  key={value.subjectExamineeId}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={checked.includes(value)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{
                        'aria-labelledby': labelId,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={value.examinee.fullName}
                    secondary={value.examinee.email}
                  />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Card>
      </>
    );
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} lg={5}>
        <TransferList items={left} title="Unassigned" />
      </Grid>
      <Grid item xs={12} lg={2}>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} lg={5}>
        <TransferList title={roomName} items={right} />
      </Grid>
    </Grid>
  );
};

export default ExamineeTransferList;
