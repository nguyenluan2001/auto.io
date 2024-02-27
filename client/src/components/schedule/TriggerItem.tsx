import { Icon } from '@iconify/react';
import {
  Collapse,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { omit } from 'lodash';
import React from 'react';

type Props = {
  title: string;
  component: any;
  handleDelete: () => void;
  others: any;
};
function TriggerItem({ title, component, handleDelete, ...others }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (e: any) => {
    e.stopPropagation();
    setExpanded((pre) => !pre);
  };
  const handleToggleTrigger = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    (others as any)?.handleUpdate({
      ...omit(others, 'handleUpdate'),
      is_active: e?.target?.checked,
    });
    return false;
  };
  return (
    <Paper variant="outlined">
      <Stack
        sx={{ width: '100%' }}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={handleChange}>
            <Icon icon={!expanded ? 'mdi:chevron-down' : 'mdi:chevron-up'} />
          </IconButton>
          <Typography>{title}</Typography>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Toggle trigger">
            <Switch
              checked={(others as any)?.is_active}
              onChange={handleToggleTrigger}
            />
          </Tooltip>
          <Tooltip title="Delete trigger">
            <IconButton onClick={handleDelete}>
              <Icon icon="mdi:delete-outline" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      {expanded && (
        <Collapse sx={{ p: 2 }} in={expanded}>
          {React.createElement(component, others)}
        </Collapse>
      )}
    </Paper>
  );
}

export default TriggerItem;
