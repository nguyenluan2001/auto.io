import React from 'react';
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import dayjs from 'dayjs';
import Theme from '@/theme/Theme';

function ProcessLog() {
  const processes = [
    {
      id: 1,
      name: 'Workflow 1',
      run_at: dayjs().format('DD/MM/YYYY'),
      duration: '30s',
      status: 'SUCCESS',
    },
    {
      id: 2,
      name: 'Workflow 1',
      run_at: dayjs().format('DD/MM/YYYY'),
      duration: '55s',
      status: 'FAILED',
    },
    {
      id: 3,
      name: 'Workflow 1',
      run_at: dayjs().format('DD/MM/YYYY'),
      duration: '20s',
      status: 'CANCELED',
    },
  ];
  return (
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
        {processes?.map((process) => (
          <TableRow key={process?.id}>
            <TableCell>{process?.name}</TableCell>
            <TableCell>{process?.run_at}</TableCell>
            <TableCell>{process?.duration}</TableCell>
            <TableCell>
              <Chip label={process?.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProcessLog;
