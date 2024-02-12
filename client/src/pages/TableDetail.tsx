import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import type { ClickEvent } from 'models/Event';
import { useTableById } from '@/hooks/useTable';
import { axiosInstance } from '@/utils/axios';
import Theme from '@/theme/Theme';
import { ROWS_PER_PAGE } from '@/utils/constant';

function TableDetail() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 10,
  });
  const { id: tableId } = useParams();
  const navigate = useNavigate();
  const {
    data: tableDetail,
    isLoading,
    refetch,
  } = useTableById({
    id: tableId as string,
    query: {
      // skip: 0,
      // take: 10,
      ...pagination,
    },
    options: {},
  });
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event?.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClearTable = async () => {
    try {
      axiosInstance.get(`/tables/${tableId}/clear`).then(() => refetch());
    } catch (error) {
      console.log('🚀 ===== handleClearTable ===== error:', error);
    }
  };

  const onChangePage = (e: any, value: number) => {
    setPage(value);
    setPagination({
      skip: (value - 1) * ROWS_PER_PAGE,
      take: ROWS_PER_PAGE,
    });
  };
  const handleBackward = () => {
    navigate(`/storage?t=tables`);
  };

  const { rows, columns } = useMemo(() => {
    const formattedRow = tableDetail?.rows?.map((row: any, index: number) => {
      const newRow = tableDetail?.columns?.reduce((pre: any, current: any) => {
        pre.push({
          name: current?.name,
          value: row?.data?.[current?.name],
        });
        return pre;
      }, []);
      return [
        {
          name: '#',
          value: index + 1,
        },
        ...newRow,
      ];
    });
    return {
      rows: formattedRow,
      columns: [{ name: '#' }, ...(tableDetail?.columns || [])],
    };
  }, [tableDetail]);
  return (
    <Theme>
      <Container maxWidth="xl" sx={{ py: 2 }}>
        <AppBar color="default" position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <Icon onClick={handleBackward} icon="mdi:chevron-left" />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {tableDetail?.name}
            </Typography>
            <IconButton onClick={handleClick}>
              <Icon icon="mdi:dots-horizontal-circle-outline" />
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
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Icon icon="mdi:edit-outline" />
                </ListItemIcon>
                <ListItemText>Edit</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClearTable}>
                <ListItemIcon>
                  <Icon icon="mdi:clear-reverse-outline" />
                </ListItemIcon>
                <ListItemText>Clear</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <Icon style={{ color: 'red' }} icon="mdi:delete-outline" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'red' }}>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
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
              {rows?.map((row: any) => (
                <TableRow key={row.id}>
                  {row.map((item: any) => (
                    <TableCell key={item.id}>{item.value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Pagination
            count={tableDetail?.meta?.totalPages}
            variant="outlined"
            shape="rounded"
            onChange={onChangePage}
            color="secondary"
          />
        </Stack>
      </Container>
    </Theme>
  );
}

export default TableDetail;
