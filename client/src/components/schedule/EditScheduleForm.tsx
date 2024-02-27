import { Icon } from '@iconify/react';
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Workflow } from 'models/Workflow';
import React from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import FieldTitle from '../common/FieldTitle';
import Cronjob from './Cronjob';
import Interval from './Interval';
import OnASpecificDate from './OnASpecificDate';
import TriggerItem from './TriggerItem';

function EditScheduleForm({
  workflows,
  control,
}: {
  workflows: Workflow[];
  control: any;
}) {
  const {
    fields: triggers,
    append,
    remove,
    update,
  } = useFieldArray({
    name: 'triggers',
    control,
  });
  const handleAddTrigger = (trigger: any) => {
    append({
      ...trigger,
      uuid: uuidv4(),
    });
  };
  const handleDeleteTrigger = (index: number) => {
    remove(index);
  };
  const handleUpdateTrigger = (index: number, value: any) => {
    update(index, {
      ...triggers[index],
      ...value,
    });
  };
  return (
    <Stack spacing={2} direction="column">
      <Box>
        <FieldTitle title="Workflow" />
        <Controller
          control={control}
          name="workflow"
          render={({ field }) => (
            <Autocomplete
              options={workflows}
              renderInput={(params) => <TextField {...params} />}
              getOptionLabel={(option) => option?.name}
              onChange={(e, value) => field?.onChange(value)}
              value={field?.value}
              isOptionEqualToValue={(option, value) =>
                option?.id?.toString() === value?.id?.toString()
              }
            />
          )}
        />
      </Box>
      <Divider />
      <Stack direction="row" justifyContent="space-between">
        <FieldTitle title="Triggers" />
        <AddTriggerButton handleAddTrigger={handleAddTrigger} />
      </Stack>
      <Box>
        {triggers?.map((trigger: any, index) => (
          <TriggerItem
            key={trigger?.uuid}
            handleDelete={() => handleDeleteTrigger(index)}
            handleUpdate={(value: any) => handleUpdateTrigger(index, value)}
            {...trigger}
          />
        ))}
      </Box>
    </Stack>
  );
}

function AddTriggerButton({
  handleAddTrigger,
}: {
  handleAddTrigger: (value: any) => void;
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const TRIGGER_CONFIG = [
    {
      id: 1,
      title: 'Interval',
      component: Interval,
      interval: 60,
      delay: 5,
      type: 'INTERVAL',
    },
    {
      id: 2,
      title: 'Cron job',
      component: Cronjob,
      expression: '* * * * *',
      type: 'CRON_JOB',
    },
    {
      id: 3,
      title: 'On a specific date',
      component: OnASpecificDate,
      date: new Date(),
      type: 'ON_A_SPECIFIC_DATE',
    },
  ];
  const handleSelectTrigger = (trigger: any) => {
    handleAddTrigger(trigger);
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        onClick={handleClick}
        variant="contained"
        endIcon={<Icon icon="mdi:chevron-down" />}
      >
        Add
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {TRIGGER_CONFIG?.map((trigger) => (
          <MenuItem
            key={trigger?.id}
            onClick={() => handleSelectTrigger(trigger)}
          >
            {trigger?.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
export default EditScheduleForm;
