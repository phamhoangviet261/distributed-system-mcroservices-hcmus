import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import style from 'styled-components';
import EditProduct from './EditProduct';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Loading from '../Loading';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  ['&:hover']: {
    cursor: "pointer",
    backgroundColor: "#EEE",
  },
}));





const Image = style.img`
    width: 50px;
`

export default function StoreTable() {

    const [product, setProduct] = useState({});
    const [rows, setRows] = useState();
    const EditButton = useRef(null);

    const HandleClick = (product) => {
      setProduct({...product});
      EditButton.current.click();
    }

    const user = JSON.parse(localStorage.getItem("UDPTuser"))

    useEffect(()=>{
      console.log(product)
    }, [product])

    useEffect(()=>{
      axios({
        method: "GET",
        url: `http://localhost:5000/products/stores/${user.storeId}`,
        data: null
    })
        .catch((err) => {
            console.log(err);
        })
        .then((res) => {
          console.log(res)
          if(res.data.data.productsDetail){
            setRows([...res.data.data.productsDetail])
          }
        });
    },[])


  return (
    <TableContainer component={Paper}>
      {!rows ? <Loading /> : rows.length > 0 ? <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell width={"100px"}></StyledTableCell>
            <StyledTableCell align="left">Tên</StyledTableCell>
            <StyledTableCell align="left">Đã bán</StyledTableCell>
            <StyledTableCell align="left">Còn lại</StyledTableCell>
            <StyledTableCell align="left">Giá</StyledTableCell>
            <StyledTableCell align="left">Chỉnh sửa</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <StyledTableRow onClick={()=>{HandleClick(row)}} key={index}>
              <StyledTableCell component="th" scope="row">
                <Image src={row.linkImg} alt='product image'/>
              </StyledTableCell>
              <StyledTableCell align="left">{row.name}</StyledTableCell>
              <StyledTableCell align="left">{row.sold}</StyledTableCell>
              <StyledTableCell align="left">{row.rest}</StyledTableCell>
              <StyledTableCell align="left">{row.price}</StyledTableCell>
              <StyledTableCell key={index} align="left"><EditProduct product={product} ref={EditButton}></EditProduct></StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody> 
        
      </Table> : <div style={{padding: "30px", fontSize: "16px", textAlign: "center"}}>Bạn Chưa Có Đơn Hàng Nào</div>}
    </TableContainer>
  );
}
