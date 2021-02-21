import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import {Button} from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';

import makeData from "./makeData";

const NO_CONTENT='No content to show';
const Styles = styled.div`
  padding: 1rem;

  Table {
    border-spacing: 0;
    border: 1px groove #d0d5db;
  }
  TableContainer {
    border-spacing: 0;
    border: 1px groove #d0d5db;
  }

  InfiniteScroll {
    overflow-y: scroll;
    height:100px;
    width: 100%;
    display:block;
  }
`;

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: theme.palette.common.black,
  },
  body: {
    fontSize: 14
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const styles = (theme) => ({
  root: {
    margin: 2,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

// Function to create table component which use data of questions to show scroll infinite
function CustomTable({ columns, data, update, stopLoader }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy }
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );
const [title, setTitle] = React.useState('');
const [author, setAuthor] = React.useState('');
const [date, setDate] = React.useState('');
const [views, setViews] = React.useState('');
const [score, setScore] = React.useState('');
const [link, setLink] = React.useState('');


  React.useEffect(() => {
    console.log("sort");
  }, [sortBy]);

  const [open, setOpen] = React.useState(false);
  const [currentIndex, setIndex] = React.useState(0);

  const handleClickOpen = (index) => {
    console.log(rows[index]);
    setOpen(true);
    setIndex(index || 0);
    setTitle(rows[index].original.title);
    setAuthor(rows[index].values.author);
    setLink(rows[index].original.link);
    setDate(rows[index].original.date);
    setViews(rows[index].original.views);
    setScore(rows[index].original.score);
  };
  const handleClose = () => {
    setOpen(false);
  };


  // Render the UI for your table
  return (
    <>
    <InfiniteScroll 
      dataLength={rows.length}
      next={update}
      hasMore={true}
      loader={ !stopLoader ? <><LinearProgress /><LinearProgress color="secondary" /></>: <></>}
    >
      <TableContainer component={Card} >
      <Table {...getTableProps()} size="small">
        <TableHead id='tableHead'>
          {headerGroups.map(headerGroup => (
            <TableRow key="table-row-head"  {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <StyledTableCell id={column} {...column.getHeaderProps(column.getSortByToggleProps())} align="left">
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (<>
              <StyledTableRow key={rows[currentIndex].values.title} id={rows[currentIndex].values.title} {...row.getRowProps()} onClick={()=> handleClickOpen(i)}>
                {row.cells.map(cell => {
                  return (
                    <>
                    <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
                    </>
                  );
                })}
              </StyledTableRow>
              </>
            );
          })}
        </TableBody>
      </Table>
      </TableContainer>

      <Dialog key='popup-model' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        <b>{title}</b>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            
          <b>Author:</b> {author}
          </Typography>
          <Typography gutterBottom>
          <b>On</b> : {date} 
          </Typography>
          <Typography gutterBottom>
            <b>Score</b>: {score} 
          </Typography>
          <Typography gutterBottom>
          <b>Total views:</b> {views} 
          </Typography>
          <Typography gutterBottom>
          <b>Link to answer:</b> <a href={link} target="_blank"> {link}</a>
          </Typography>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            OK
          </Button>
              </DialogActions>
              </Dialog>
    </InfiniteScroll>
    </>
  );
}

 function App() {
  const [items, setItems] =  useState([]);
  const [question, setQuestions] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');


  useEffect(()=>{
    fetch('https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow')
    .then((response)=> response.json())
    .then((resp)=>{
        if( !resp || !resp.items){
            resp.items = [];
            setErrorMsg(NO_CONTENT);
        }
        let all_questions=[]
        for(let i =0 ; i<resp.items.length ; i++)
        {
        let obj = {
          title:resp.items[i].title,
          author:resp.items[i].owner.display_name,
          date:new Date(resp.items[i].creation_date*1000).toISOString().split('T')[0],
            isAnswered  : resp.items[i].is_answered,
            score: resp.items[i].score,
            views: resp.items[i].view_count,
            tags: resp.items[i].tags,
        link: resp.items[i].link
        }
        all_questions.push(obj)
      }
        setQuestions(all_questions);
        setItems([]);
        setItems(all_questions.filter((q, i)=> i < 19));
      })
  }, []);
  

  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title"
      },
      {
        Header: "Author",
        accessor: "author"
      },
      {
        Header: "Date",
        accessor: "date"
      },

    ],
    []
  );

  const fetchMoreData = () => {
    setTimeout(() => {
      setItems(makeData(question, items.length + 2));
    }, 1500);
  };

  const data = React.useMemo(() => items, [items]);

  return (
    <>
    <Styles>
      <CustomTable key="custom-table" columns={columns} data={data} update={fetchMoreData}  stopLoader={question.length <= items.length}/>
      <p>{errorMsg}</p>
    </Styles>
  </>
  );
}

export default App;
