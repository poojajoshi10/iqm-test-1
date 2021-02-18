import React, { useEffect, useState } from "react";
import { withStyles } from '@material-ui/core/styles';
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import {Modal, Button} from 'react-bootstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import makeData from "./makeData";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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

// function QAPopup(props){
//   console.log(props);
//   const [open, setOpen] = React.useState(false);


//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//   <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
//         <DialogTitle id="customized-dialog-title" onClose={handleClose}>
//           Modal title
//         </DialogTitle>
//         <DialogContent dividers>
//           <Typography gutterBottom>
//             Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
//             in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
//           </Typography>
//           <Typography gutterBottom>
//             Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
//             lacus vel augue laoreet rutrum faucibus dolor auctor.
//           </Typography>
//           <Typography gutterBottom>
//             Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
//             scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
//             auctor fringilla.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button autoFocus onClick={handleClose} color="primary">
//             Save changes
//           </Button>
//         </DialogActions>
//       </Dialog>
//   );
// }

function Table({ columns, data, update }) {
  // Use the state and functions returned from useTable to build your UI
  const [modalShow, setModalShow] = React.useState(false);


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

  React.useEffect(() => {
    console.log("sort");
  }, [sortBy]);

  const [open, setOpen] = React.useState(false);
  const [currentIndex, setIndex] = React.useState(0);

  const handleClickOpen = (index) => {
    console.log('Current function', index);
    setOpen(true);
    setIndex(index || 0);
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
      loader={<h4>Loading more 2 items...</h4>}
    >
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr  {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            console.log(row);
            prepareRow(row);
            return (<>
              <tr id={rows[currentIndex].original.title} {...row.getRowProps()} onClick={()=> handleClickOpen(i)}>
                {row.cells.map(cell => {
                  return (
                    <>
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    </>
                  );
                })}
              </tr>
              <Dialog id={rows[i].original.title} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
              <DialogTitle id="customized-dialog-title" onClose={handleClose}>
              <b>{rows[currentIndex].original.title}</b>
              </DialogTitle>
              <DialogContent dividers>
                <Typography gutterBottom>
                <b>Author:</b> {rows[currentIndex].original.owner.display_name}
                </Typography>
                <Typography gutterBottom>
                <b>On</b> : {new Date(rows[currentIndex].original.creation_date*1000).toISOString().split('T')[0]} 
                </Typography>
                <Typography gutterBottom>
                  <b>Score</b>: {rows[currentIndex].original.score} 
                </Typography>
                <Typography gutterBottom>
                <b>Total views:</b> {rows[currentIndex].original.view_count} 
                </Typography>
                <Typography gutterBottom>
                <b>Link to answer:</b> <a href={rows[currentIndex].original.link}> {rows[currentIndex].original.link}</a>
                </Typography>
      
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={handleClose} color="primary">
                  Save changes
                </Button>
              </DialogActions>
              </Dialog>
              </>
            );
          })}
        </tbody>
      </table>
    </InfiniteScroll>
    </>
  );
}

 function App() {
  const [items, setItems] =  useState([]);

  useEffect(()=>{
    fetch('https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow')
    .then((response)=> response.json())
    .then((resp)=>{
        console.log(resp.items);
        setItems(resp.items, 10);
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
      setItems(items.concat(makeData(items, 5)));
    }, 1500);
  };

  const data = React.useMemo(() => items, [items]);

  return (
    <Styles>
      <Table columns={columns} data={data} update={fetchMoreData} />
    </Styles>
  );
}

export default App;
