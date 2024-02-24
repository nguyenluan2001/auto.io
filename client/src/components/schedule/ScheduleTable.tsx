import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { isEmpty } from 'lodash';
import Theme from '@/theme/Theme';
import LoadingIcon from '../common/LoadingIcon';
import Empty from '../common/Empty';

function ScheduleTable({ schedules = [] }) {
  return (
    <Theme>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Schedule</TableCell>
            <TableCell>Next run</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableBodyDecision isLoading={false} schedules={schedules} />
        </TableBody>
      </Table>
    </Theme>
  );
}
function TableBodyDecision({
  schedules,
  isLoading,
}: {
  schedules: any[];
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
  if (isEmpty(schedules)) {
    return (
      <TableRow>
        <TableCell sx={{ p: 0 }} colSpan={4}>
          <Empty />
        </TableCell>
      </TableRow>
    );
  }
  return <>Schedule table</>;
}

export default ScheduleTable;
