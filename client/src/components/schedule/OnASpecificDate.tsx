import React from 'react';
import { Box, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

function OnASpecificDate({ date, handleUpdate }) {
  const handleChange = (value) => {
    handleUpdate({
      date: value,
    });
  };
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={2}>
      <DateTimePicker
        defaultValue={dayjs('2022-04-17T15:30')}
        sx={{ width: '100%' }}
        onChange={handleChange}
      />
    </Stack>
  );
}

export default OnASpecificDate;
