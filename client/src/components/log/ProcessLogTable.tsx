import dotsHorizontalCircleOutline from '@iconify/icons-mdi/dots-horizontal-circle-outline';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import { ClickEvent } from 'models/Event';
import { Process } from 'models/Process';
import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { convertPage } from '@/utils/pagination';
import { ROWS_PER_PAGE } from '@/utils/constant';
import { axiosInstance } from '@/utils/axios';
import { useProcesses } from '@/hooks/useProcesses';
import Empty from '../common/Empty';
import LoadingIcon from '../common/LoadingIcon';
import SearchBar from '../common/SearchBar';
import CustomDialog from '../common/CustomDialog';

type Props = {
  uuid?: string | null;
};
function ProcessLogTable({ uuid = null }: Props) {
  const [page, setPage] = useState(1);
  const [keywords, setKeywords] = useState('');
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const {
    data: { processes, meta },
    isLoading,
    isFetching,
    refetch,
  } = useProcesses({
    params: {
      where: {
        ...(uuid
          ? {
              workflow: {
                uuid,
              },
            }
          : {
              workflow: {
                name: {
                  contains: keywords,
                  mode: 'insensitive',
                },
              },
            }),
      },
      ...convertPage({ page, pageSize: ROWS_PER_PAGE }),
      orderBy: {
        id: 'desc',
      },
    },
    options: {},
  });
  const onChangePage = (e: any, value: number) => {
    setPage(value);
  };
  const onRefresh = () => {
    refetch();
  };
  const onClearLog = async () => {
    try {
      await axiosInstance.post(`/api/processes/clear`, {
        workflowUUID: uuid,
      });
      enqueueSnackbar('Clear log successfully', {
        variant: 'success',
      });
      refetch();
      toggleConfirmDialog();
    } catch (error) {
      enqueueSnackbar('Clear log failed', {
        variant: 'error',
      });
    }
  };
  const toggleConfirmDialog = () => setIsOpenConfirmDialog((pre) => !pre);
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        {!uuid && <SearchBar keywords={keywords} setKeywords={setKeywords} />}
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={2}>
          <Button
            onClick={toggleConfirmDialog}
            variant="contained"
            startIcon={<Icon icon="icon-park-outline:clear" />}
          >
            Clear log
          </Button>
          <Button
            onClick={onRefresh}
            variant="contained"
            startIcon={<Icon icon="ion:refresh" />}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Run at</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableBodyDecision
            isLoading={isLoading || isFetching}
            processes={processes}
            refetch={refetch}
          />
        </TableBody>
      </Table>
      {!isEmpty(processes) && (
        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Pagination
            count={meta?.totalPages}
            variant="outlined"
            shape="rounded"
            onChange={onChangePage}
            color="secondary"
            page={page}
          />
        </Stack>
      )}
      <CustomDialog
        open={isOpenConfirmDialog}
        title="Clear logs"
        description="Are you sure you want to clear all logs? "
        handleCancel={toggleConfirmDialog}
        handleConfirm={onClearLog}
      />
    </Stack>
  );
}
function TableBodyDecision({
  processes,
  isLoading,
  refetch,
}: {
  processes: Process[];
  isLoading: boolean;
  refetch: () => void;
}) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={6}>
          <LoadingIcon />
        </TableCell>
      </TableRow>
    );
  }
  if (isEmpty(processes)) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={6}>
          <Empty />
        </TableCell>
      </TableRow>
    );
  }
  return processes?.map((process, index) => {
    return (
      <TableItem
        key={process?.id}
        index={index + 1}
        process={process}
        refetch={refetch}
      />
    );
  });
}

function TableItem({
  process,
  refetch,
  index,
}: {
  process: any;
  refetch: () => void;
  index: number;
}) {
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
  const handleCancelProcess = async () => {
    await axiosInstance.get(`/api/processes/${process?.uuid}/cancel`);
    refetch();
  };
  const handleDeleteProcess = async () => {
    try {
      await axiosInstance.delete(`/api/processes/${process?.uuid}`);
      refetch();
      enqueueSnackbar('Delete log successfully', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Delete log failed', {
        variant: 'error',
      });
    }
  };
  return (
    <TableRow key={process?.id}>
      <TableCell>{index}</TableCell>
      <TableCell>{process?.workflow?.name}</TableCell>
      <TableCell>
        {dayjs(process?.createdAt).format('HH:mm DD/MM/YYYY')}
      </TableCell>
      <TableCell>{process?.duration}s</TableCell>
      <TableCell>
        {process?.status === 'SUCCESS' && (
          <Chip
            avatar={<Icon icon="gg:check-o" />}
            color="success"
            label={process?.status}
          />
        )}
        {process?.status === 'RUNNING' && (
          <Chip
            avatar={<Icon icon="eos-icons:loading" />}
            color="warning"
            label={process?.status}
          />
        )}
        {['FAILED', 'CANCELED']?.includes(process?.status) && (
          <Chip
            avatar={<Icon icon="ic:outline-cancel" />}
            color="error"
            label={process?.status}
          />
        )}
      </TableCell>
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
          <MenuItem
            disabled={process?.status !== 'RUNNING'}
            onClick={handleCancelProcess}
          >
            Cancel
          </MenuItem>
          <MenuItem onClick={handleDeleteProcess}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default ProcessLogTable;
