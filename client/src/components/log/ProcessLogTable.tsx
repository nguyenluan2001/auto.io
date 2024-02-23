import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
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
import { Icon } from '@iconify/react';
import { Process } from 'models/Process';
import Theme from '@/theme/Theme';
import { useProcesses } from '@/hooks/useProcesses';
import LoadingScreen from '../common/LoadingScreen';
import LoadingIcon from '../common/LoadingIcon';
import { ROWS_PER_PAGE } from '@/utils/constant';
import { convertPage } from '@/utils/pagination';
import SearchBar from '../common/SearchBar';
import Empty from '../common/Empty';

type Props = {
  uuid?: string | null;
};
function ProcessLogTable({ uuid = null }: Props) {
  const [page, setPage] = useState(1);
  const [keywords, setKeywords] = useState('');
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
  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        {!uuid && <SearchBar keywords={keywords} setKeywords={setKeywords} />}
        <Box sx={{ flex: 1 }} />
        <Button
          onClick={onRefresh}
          variant="contained"
          startIcon={<Icon icon="ion:refresh" />}
        >
          Refresh
        </Button>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Run at</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableBodyDecision
            isLoading={isLoading || isFetching}
            processes={processes}
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
    </Stack>
  );
}
function TableBodyDecision({
  processes,
  isLoading,
}: {
  processes: Process[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={4}>
          <LoadingIcon />
        </TableCell>
      </TableRow>
    );
  }
  if (isEmpty(processes)) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={4}>
          <Empty />
        </TableCell>
      </TableRow>
    );
  }
  return processes?.map((process) => {
    return (
      <TableRow key={process?.id}>
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
      </TableRow>
    );
  });
}

export default ProcessLogTable;
