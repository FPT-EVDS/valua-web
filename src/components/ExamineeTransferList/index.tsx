import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
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
import Examinee from 'models/examinee.model';
import React, { useEffect, useState } from 'react';

interface Props {
  listExamineeByRoom: Examinee[][];
  selectedIndex: number;
  roomName: string;
  handleSelected: (examinee: Examinee[]) => void;
}

interface TransferListProps {
  title: React.ReactNode;
  items: Examinee[];
}

function not(a: Examinee[], b: Examinee[]) {
  return a.filter(value => !b.includes(value));
}

function intersection(a: Examinee[], b: Examinee[]) {
  return a.filter(value => b.includes(value));
}

function union(a: Examinee[], b: Examinee[]) {
  return [...a, ...not(b, a)];
}

const ExamineeTransferList = ({
  listExamineeByRoom,
  selectedIndex,
  roomName,
  handleSelected,
}: Props) => {
  const removedExaminees = useAppSelector(
    state => state.addExamRoom.removedExaminees,
  );
  const [checked, setChecked] = useState<Examinee[]>([]);
  const [left, setLeft] = useState<Examinee[]>([]);
  const [right, setRight] = useState<Examinee[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    setRight(
      listExamineeByRoom[selectedIndex].filter(
        value => !removedExaminees.includes(value),
      ),
    );
    handleSelected(listExamineeByRoom[selectedIndex]);
    setLeft([
      ...listExamineeByRoom
        .filter((value, index) => index !== selectedIndex)
        .flat()
        .filter(value => !listExamineeByRoom[selectedIndex].includes(value)),
      ...removedExaminees,
    ]);
    setChecked([]);
  }, [listExamineeByRoom, selectedIndex]);

  const handleToggle = (value: Examinee) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: Examinee[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: Examinee[]) => () => {
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
    const [filteredItems, setFilteredItems] = useState<Examinee[]>(items);

    const handleIsSearch = () => {
      setIsSearch(prev => !prev);
    };

    useEffect(() => {
      const searchList = items.filter(
        ({ examinee: { companyId, email, fullName } }) =>
          companyId.includes(searchValue) ||
          email.includes(searchValue) ||
          fullName.includes(searchValue),
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
              const labelId = `transfer-list-all-item-${value.subjectExamineeID}-label`;

              return (
                <ListItem
                  key={value.subjectExamineeID}
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
