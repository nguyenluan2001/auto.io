import {
  Autocomplete,
  Box,
  Button,
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
import React, { useEffect, useState } from 'react';
import plusBoxOutline from '@iconify/icons-mdi/plus-box-outline';
import deleteOutline from '@iconify/icons-mdi/delete-outline';
import dotsHorizontalCircleOutline from '@iconify/icons-mdi/dots-horizontal-circle-outline';

import { Icon } from '@iconify/react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { Table as TableType } from 'models/Table';
import { ClickEvent } from 'models/Event';
import { axiosInstance } from '@/utils/axios';
import { useTables } from '@/hooks/useTables';
import { useTableById } from '@/hooks/useTable';

type ListingProps = {
  tables: any;
  refetch: () => void;
  isLoading: boolean;
  setSelectedTable: (tableData: TableType) => void;
};
type TableItemProps = {
  table: any;
  refetch: () => void;
  setSelectedTable: (tableData: TableType) => void;
};
type DialogAddTableProps = {
  open: boolean;
  handleToggleDialog: () => void;
  refetch: () => void;
  initialData: TableType | null;
};
type ColumnItemProps = {
  column: Record<string, string>;
  index: number;
  control: any;
  handleRemoveColumn: () => void;
};
type DialogTableDetailProps = {
  table: any;
  open: boolean;
  handleToggleDetail: () => void;
};
type TableDataProps = {
  columns: Record<string, string>[];
  rows: any;
};
function DialogAddTable({
  open,
  handleToggleDialog,
  refetch,
  initialData,
}: DialogAddTableProps) {
  console.log('🚀 ===== initialData:', initialData);
  const { control, handleSubmit, watch, setValue } = useForm<TableType>({
    defaultValues: {
      name: '',
      columns: [],
    },
  });
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'columns' as never,
  });
  useEffect(() => {
    console.log('🚀 ===== DialogAddTable ===== watch:', watch());
  }, [watch()]);
  useEffect(() => {
    if (initialData) {
      const { name, columns } = initialData;
      setValue('name', name);
      setValue('columns', columns);
    }
  }, [initialData]);
  const handleAddColumn = () => {
    const countColumn = fields.length;
    append({ name: `Column ${countColumn + 1}`, data_type: '' });
  };
  const handleUpdateColumn = (index: number, values: any) => {
    update(index, values);
  };
  const handleRemoveColumn = (index: number) => {
    remove(index);
  };
  const onSubmit = async (values: any) => {
    try {
      if (initialData) {
        const { id } = initialData;
        await axiosInstance.put(`/tables/${id}`, values);
        enqueueSnackbar('Update table successfully', {
          variant: 'success',
        });
      } else {
        const response = await axiosInstance.post('/tables', values);
        enqueueSnackbar('Create table successfully', {
          variant: 'success',
        });
      }
      handleToggleDialog();
      refetch();
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
function TableItem({ table, refetch, setSelectedTable }: TableItemProps) {
  const [isOpenDialogDetail, setIsOpenDialogDetail] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: ClickEvent) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e: ClickEvent) => {
    e.stopPropagation();
    setAnchorEl(null);
  };
  const handleDeleteTable = async (e: any) => {
    e.stopPropagation();
    await axiosInstance.delete(`/tables/${table?.id}`);
    refetch();
  };
  const handleClickEdit = (e: ClickEvent) => {
    e.stopPropagation();
    setSelectedTable(table);
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
          <IconButton onClick={handleClick}>
            <Icon icon={dotsHorizontalCircleOutline} />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
            <MenuItem onClick={handleClose}>Delete</MenuItem>
          </Menu>
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
function Listing({
  tables,
  refetch,
  isLoading,
  setSelectedTable,
}: ListingProps) {
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
        {tables?.map((row: any) => (
          <TableItem
            setSelectedTable={setSelectedTable}
            refetch={refetch}
            table={row}
            key={row.name}
          />
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
function ColumnItem({
  column,
  index,
  control,
  handleRemoveColumn,
}: ColumnItemProps) {
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
function DialogTableDetail({
  table,
  open,
  handleToggleDetail,
}: DialogTableDetailProps) {
  const {
    data: tableDetail,
    isLoading,
    refetch,
  } = useTableById({
    id: table?.id as string,
    options: {},
  });
  const handleClearTable = async () => {
    try {
      axiosInstance.get(`/tables/${table?.id}/clear`).then(() => refetch());
    } catch (error) {
      console.log('🚀 ===== handleClearTable ===== error:', error);
    }
  };
  return (
    <Dialog open={open} fullWidth maxWidth="xl">
      <DialogContent>
        <TableData columns={tableDetail?.columns} rows={tableDetail?.rows} />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={handleClearTable}>
          Clear
        </Button>
        <Button variant="contained" onClick={handleToggleDetail}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
function TableData({ columns, rows }: TableDataProps) {
  console.log('🚀 ===== TableData ===== rows:', rows);
  const formattedRows = rows?.map((row: any) => {
    return columns?.reduce((pre, current) => {
      pre.push({
        name: current?.name,
        value: row?.data?.[current?.name],
      } as never);
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
          {formattedRows?.map((row: any) => (
            <TableRow key={row.id}>
              {row.map((item: any) => (
                <TableCell key={item.id}>{item.value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
function TableList() {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { data: tables, isLoading, refetch } = useTables({ options: {} });
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const handleToggleDialog = () => {
    setSelectedTable(null);
    setIsOpenDialog((pre) => !pre);
  };
  useEffect(() => {
    if (selectedTable) {
      setIsOpenDialog(true);
    }
  }, [selectedTable]);
  return (
    <Box sx={{ width: '100%' }}>
      <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
        <TextField />
        <Button variant="contained" size="small" onClick={handleToggleDialog}>
          Add table
        </Button>
      </Stack>
      <Listing
        setSelectedTable={setSelectedTable}
        isLoading={isLoading}
        tables={tables}
        refetch={refetch}
      />
      <DialogAddTable
        open={isOpenDialog}
        handleToggleDialog={handleToggleDialog}
        refetch={refetch}
        initialData={selectedTable}
      />
    </Box>
  );
}
export default TableList;
