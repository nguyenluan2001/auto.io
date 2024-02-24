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
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import FieldTitle from '../common/FieldTitle';
import TriggerItem from './TriggerItem';
import Interval from './Interval';
import Cronjob from './Cronjob';
import OnASpecificDate from './OnASpecificDate';

function EditScheduleForm({ workflows, control }) {
  //   const { control, watch } = useForm({
  //     defaultValues: {
  //       workflow: null,
  //       triggers: [],
  //       //   triggers: [
  //       //     {
  //       //       title: 'Interval',
  //       //       component: Interval,
  //       //       interval: 60,
  //       //       delay: 5,
  //       //     },
  //       //     {
  //       //       title: 'Cron job',
  //       //       component: Cronjob,
  //       //       expression: '* * * * *',
  //       //     },
  //       //     {
  //       //       title: 'On a specific date',
  //       //       component: OnASpecificDate,
  //       //       date: new Date(),
  //       //     },
  //       //   ],
  //     },
  //   });
  const {
    fields: triggers,
    append,
    remove,
    update,
  } = useFieldArray({
    name: 'triggers',
    control,
  });
  const handleAddTrigger = (trigger) => {
    append({
      ...trigger,
      uuid: uuidv4(),
    });
  };
  const handleDeleteTrigger = (index) => {
    remove(index);
  };
  const handleUpdateTrigger = (index, value) => {
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
        {triggers?.map((trigger, index) => (
          <TriggerItem
            key={trigger?.uuid}
            handleDelete={() => handleDeleteTrigger(index)}
            handleUpdate={(value) => handleUpdateTrigger(index, value)}
            {...trigger}
          />
        ))}
      </Box>
    </Stack>
  );
}

function AddTriggerButton({ handleAddTrigger }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
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
    },
    {
      id: 2,
      title: 'Cron job',
      component: Cronjob,
      expression: '* * * * *',
    },
    {
      id: 3,
      title: 'On a specific date',
      component: OnASpecificDate,
      date: new Date(),
    },
  ];
  const handleSelectTrigger = (trigger) => {
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
