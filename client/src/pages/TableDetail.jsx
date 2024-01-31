import React, { useMemo } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTableById } from '@/hooks/useTable';
import { axiosInstance } from '@/utils/axios';

function TableDetail() {
  const { id: tableId } = useParams();
  const {
    data: tableDetail,
    isLoading,
    refetch,
  } = useTableById({
    id: tableId,
    options: {},
  });
  const handleClearTable = async () => {
    try {
      axiosInstance.get(`/tables/${tableId}/clear`).then(() => refetch());
    } catch (error) {
      console.log('🚀 ===== handleClearTable ===== error:', error);
    }
  };

  const { rows, columns } = useMemo(() => {
    const formattedRow = tableDetail?.rows?.map((row) => {
      return tableDetail?.columns?.reduce((pre, current) => {
        pre.push({
          name: current?.name,
          value: row?.data?.[current?.name],
        });
        return pre;
      }, []);
    });
    return { rows: formattedRow, columns: tableDetail?.columns };
  }, [tableDetail]);
  console.log('🚀 ===== const{rows,columns}=useMemo ===== columns:', columns);
  console.log('🚀 ===== const{rows,columns}=useMemo ===== rows:', rows);
  //   console.log('🚀 ===== formattedRows ===== formattedRows:', formattedRows);
  return (
    <Container maxWidth="xl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <TableCell key={column.id}>{column.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row) => (
              <TableRow key={row.id}>
                {row.map((item) => (
                  <TableCell key={item.id}>{item.value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TableDetail;
