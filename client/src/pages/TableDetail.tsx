import { Icon } from '@iconify/react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
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
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { isEmpty } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomDialog from '@/components/common/CustomDialog';
import Empty from '@/components/common/Empty';
import { useTableById } from '@/hooks/useTable';
import Theme from '@/theme/Theme';
import { axiosInstance } from '@/utils/axios';
import { FILE_EXTENSION, ROWS_PER_PAGE } from '@/utils/constant';

type Extension =
  | 'application/json'
  | 'application/csv'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function TableDetail() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    skip: 0,
    take: 10,
  });
  const [isOpenConfirmClear, setIsOpenConfirmClear] = useState(false);
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
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
  const handleClearData = async () => {
    try {
      axiosInstance.get(`/api/tables/${tableId}/clear`).then(() => {
        enqueueSnackbar('Clear data successfully', {
          variant: 'success',
        });
        toggleConfirmClear();
        refetch();
      });
    } catch (error) {
      console.log('🚀 ===== handleClearTable ===== error:', error);
      enqueueSnackbar('Clear data failed', {
        variant: 'error',
      });
    }
  };
  const handleDeleteTable = async () => {
    try {
      axiosInstance
        .delete(`/api/tables/${tableId}`)
        .then(() => handleBackward());
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
  const handleExport = async (type: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/tables/${tableId}/export?t=${type}`,
        {
          responseType: 'blob',
        }
      );
      console.log('🚀 ===== handleExport ===== response:', response);
      // // Create a URL for the blob and initiate download
      const url = window.URL.createObjectURL(response?.data);

      const a = document.createElement('a');
      const extension = FILE_EXTENSION[response?.data?.type as Extension];
      a.href = url;
      a.download = `data.${extension}`; // Replace with the desired filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      enqueueSnackbar('Export failed', {
        variant: 'error',
      });
    }
  };
  const toggleConfirmClear = () => setIsOpenConfirmClear((pre) => !pre);
  const toggleConfirmDelete = () => setIsOpenConfirmDelete((pre) => !pre);

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
        <AppBar color="default" position="static" sx={{ mb: 4 }}>
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
            <Stack direction="row">
              <Tooltip title="Clear Data" placement="top">
                <IconButton onClick={toggleConfirmClear}>
                  <Icon icon="icon-park-outline:clear" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Table" placement="top">
                <IconButton onClick={toggleConfirmDelete}>
                  <Icon icon="mdi:delete-outline" style={{ color: 'red' }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              endIcon={<Icon icon="mdi:chevron-down" />}
              onClick={handleClick}
              variant="contained"
            >
              Export data
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  width: '150px',
                },
              }}
            >
              <MenuItem onClick={() => handleExport('JSON')}>JSON</MenuItem>
              <MenuItem onClick={() => handleExport('CSV')}>CSV</MenuItem>
              <MenuItem onClick={() => handleExport('EXCEL')}>EXCEL</MenuItem>
            </Menu>
          </Stack>
          <Box>
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
                  <TableBodyDecision rows={rows} columns={columns} />
                </TableBody>
              </Table>
            </TableContainer>
            {!isEmpty(rows) && (
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                <Pagination
                  count={tableDetail?.meta?.totalPages}
                  variant="outlined"
                  shape="rounded"
                  onChange={onChangePage}
                  color="secondary"
                />
              </Stack>
            )}
          </Box>
        </Stack>
        <CustomDialog
          open={isOpenConfirmClear}
          title="Clear Data"
          description="Are you sure you want to clear data?  "
          handleCancel={toggleConfirmClear}
          handleConfirm={handleClearData}
        />
        <CustomDialog
          open={isOpenConfirmDelete}
          title="Delete Table"
          description="Are you sure you want to delete this table?  "
          handleCancel={toggleConfirmDelete}
          handleConfirm={handleDeleteTable}
        />
      </Container>
    </Theme>
  );
}
type Props = {
  rows: any;
  columns: any;
};
function TableBodyDecision({ rows, columns }: Props) {
  if (isEmpty(rows)) {
    return (
      <TableRow>
        <TableCell colSpan={columns?.length}>
          <Empty />
        </TableCell>
      </TableRow>
    );
  }

  return rows?.map((row: any) => (
    <TableRow key={row.id}>
      {row.map((item: any) => (
        <TableCell key={item.id}>{item.value}</TableCell>
      ))}
    </TableRow>
  ));
}

export default TableDetail;
