import React from 'react';
import {
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { isEmpty } from 'lodash';
import { Icon } from '@iconify/react';
import dotsHorizontalCircleOutline from '@iconify/icons-mdi/dots-horizontal-circle-outline';
import { ClickEvent } from 'models/Event';
import Theme from '@/theme/Theme';
import LoadingIcon from '../common/LoadingIcon';
import Empty from '../common/Empty';
import { axiosInstance } from '@/utils/axios';

function ScheduleTable({
  schedules = [],
  isLoading,
  setSelectedSchedule,
  refetch,
}: {
  schedules: any;
  isLoading: boolean;
  setSelectedSchedule: (value: any) => void;
  refetch: () => void;
}) {
  return (
    <Theme>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell />
            {/* <TableCell>Schedule</TableCell>
            <TableCell>Next run</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableBodyDecision
            setSelectedSchedule={setSelectedSchedule}
            isLoading={isLoading}
            schedules={schedules}
            refetch={refetch}
          />
        </TableBody>
      </Table>
    </Theme>
  );
}
function TableBodyDecision({
  schedules,
  isLoading,
  setSelectedSchedule,
  refetch,
}: {
  schedules: any[];
  isLoading: boolean;
  setSelectedSchedule: (schedule: any) => void;
  refetch: () => void;
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
  return schedules?.map((schedule, index) => (
    <TableItem
      key={schedule?.id}
      refetch={refetch}
      setSelectedSchedule={setSelectedSchedule}
      schedule={schedule}
      index={index + 1}
    />
  ));
}
function TableItem({
  schedule,
  setSelectedSchedule,
  refetch,
  index,
}: {
  schedule: any;
  setSelectedSchedule: (value: any) => void;
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
  const handleClickEdit = () => {
    setSelectedSchedule(schedule);
  };
  const handleDelete = async () => {
    await axiosInstance.delete(`/api/schedules/${schedule?.id}`);
    refetch();
  };
  return (
    <TableRow key={schedule?.id}>
      <TableCell>{index}</TableCell>
      <TableCell>{schedule?.workflow?.name}</TableCell>
      <TableCell>
        {schedule?.status === 'ACTIVE' && (
          <Chip
            avatar={<Icon icon="gg:check-o" />}
            color="success"
            label={schedule?.status}
          />
        )}
        {schedule?.status === 'INACTIVE' && (
          <Chip
            avatar={<Icon icon="ic:outline-cancel" />}
            color="error"
            label={schedule?.status}
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
          <MenuItem onClick={handleClickEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
}

export default ScheduleTable;
