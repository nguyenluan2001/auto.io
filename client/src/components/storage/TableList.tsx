import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import React, { useEffect, useState } from 'react';
import plusBoxOutline from '@iconify/icons-mdi/plus-box-outline';
import deleteOutline from '@iconify/icons-mdi/delete-outline';

import { Icon } from '@iconify/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { axiosInstance } from '@/utils/axios';
import { useTables } from '@/hooks/useTables';
import { useTableById } from '@/hooks/useTable';

function TableList() {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { data: tables, isLoading, refetch } = useTables({ options: {} });
  console.log('🚀 ===== TableList ===== tables:', tables);
  const handleToggleDialog = () => setIsOpenDialog((pre) => !pre);
  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
        <TextField />
        <Button variant="contained" size="small" onClick={handleToggleDialog}>
          Add table
        </Button>
      </Stack>
      <Listing isLoading={isLoading} tables={tables} refetch={refetch} />
      <DialogAddTable
        open={isOpenDialog}
        handleToggleDialog={handleToggleDialog}
        refetch={refetch}
      />
    </Box>
  );
}
function Listing({ tables, refetch, isLoading }) {
  let tableBody = null;
  if (isLoading) {
    tableBody = (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4}>Loading...</TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    tableBody = (
      <TableBody>
        {tables?.map((row) => (
          <TableItem refetch={refetch} table={row} key={row.name} />
        ))}
      </TableBody>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Created at</TableCell>
            <TableCell align="left">Updated at</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        {tableBody}
      </Table>
    </TableContainer>
  );
}
function TableItem({ table, refetch }) {
  const [isOpenDialogDetail, setIsOpenDialogDetail] = useState(false);
  const handleDeleteTable = async (e) => {
    e.stopPropagation();
    await axiosInstance.delete(`/tables/${table?.id}`);
    refetch();
  };
  const handleToggleDetail = () => {
    setIsOpenDialogDetail((pre) => !pre);
  };
  return (
    <>
      <TableRow
        key={table.name}
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          cursor: 'pointer',
        }}
        onClick={handleToggleDetail}
      >
        <TableCell align="left">{table.name}</TableCell>
        <TableCell align="left">{table.createdAt}</TableCell>
        <TableCell align="left">{table.updatedAt}</TableCell>
        <TableCell align="left">
          <IconButton onClick={handleDeleteTable}>
            <Icon icon={deleteOutline} />
          </IconButton>
        </TableCell>
      </TableRow>
      <DialogTableDetail
        table={table}
        open={isOpenDialogDetail}
        handleToggleDetail={handleToggleDetail}
      />
    </>
  );
}
function DialogAddTable({ open, handleToggleDialog, refetch }) {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: '',
      columns: [],
    },
  });
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'columns',
  });
  useEffect(() => {
    console.log('🚀 ===== DialogAddTable ===== watch:', watch());
  }, [watch()]);
  const handleAddColumn = () => {
    const countColumn = fields.length;
    append({ name: `Column ${countColumn + 1}`, data_type: '' });
  };
  const handleUpdateColumn = (index, values) => {
    update(index, values);
  };
  const handleRemoveColumn = (index) => {
    remove(index);
  };
  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.post('/tables', values);
      handleToggleDialog();
      refetch();
      enqueueSnackbar('Create table successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.log('🚀 ===== onSubmit ===== error:', error);
      enqueueSnackbar('Create table fail', {
        variant: 'error',
      });
    }
    console.log('🚀 ===== onSubmit ===== values:', values);
  };
  return (
    <Dialog open={open} fullWidth maxWidth="md">
      <DialogTitle>Add Table</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="subtitle1">Table name</Typography>
          <Controller
            control={control}
            name="name"
            render={({ field }) => <TextField fullWidth {...field} />}
          />
        </Box>
        <Box>
          <Stack direction="row" justifyContent="space-between">
            <Typography>Columns</Typography>
            <IconButton onClick={handleAddColumn}>
              <Icon icon={plusBoxOutline} />
            </IconButton>
          </Stack>
          <Stack direction="column" spacing={2}>
            {fields?.map((column, index) => (
              <ColumnItem
                control={control}
                index={index}
                column={column}
                handleUpdateColumn={handleUpdateColumn}
                handleRemoveColumn={() => handleRemoveColumn(index)}
                key={column.id}
              />
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="end">
          <Button onClick={handleToggleDialog} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
function ColumnItem({ column, index, control, handleRemoveColumn }) {
  console.log('🚀 ===== ColumnItem ===== column:', column);
  console.log('🚀 ===== ColumnItem ===== index:', index);
  return (
    <Stack direction="row" spacing={2}>
      <Controller
        control={control}
        name={`columns.${index}.name`}
        render={({ field }) => (
          <TextField
            sx={{ flex: 1 }}
            value={field?.value}
            onChange={(e) => field?.onChange(e.target.value)}
          />
        )}
      />
      <Controller
        control={control}
        name={`columns.${index}.data_type`}
        render={({ field }) => (
          <Autocomplete
            sx={{ flex: 1 }}
            options={[]}
            renderInput={(params) => <TextField {...params} />}
          />
        )}
      />
      <IconButton onClick={handleRemoveColumn}>
        <Icon icon={deleteOutline} />
      </IconButton>
    </Stack>
  );
}
function DialogTableDetail({ table, open, handleToggleDetail }) {
  const { data: tableDetail, isLoading } = useTableById({ id: table?.id });
  return (
    <Dialog open={open} fullWidth maxWidth="xl">
      <DialogContent>
        <TableData columns={tableDetail?.columns} rows={tableDetail?.rows} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleToggleDetail}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function TableData({ columns, rows }) {
  console.log("🚀 ===== TableData ===== rows:", rows);
  const formattedRows = rows?.map((row) => {
    return columns?.reduce((pre, current) => {
      pre.push({ name: current?.name, value: row?.data?.[current?.name] });
      return pre;
    }, []);
  });
  console.log('🚀 ===== formattedRows ===== formattedRows:', formattedRows);
  return (
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
          {formattedRows?.map((row) => (
            <TableRow key={row.id}>
              {row.map((item) => (
                <TableCell key={item.id}>{item.value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default TableList;
