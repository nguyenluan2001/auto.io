import React from 'react';
import { Box, Stack } from '@mui/material';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

function Interval({ interval, delay, handleUpdate }) {
  const handleChange = (e, field) => {
    const value = e?.target?.value;
    handleUpdate({
      [field]: value,
    });
  };
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={2}>
      <Box>
        <FieldTitle title="Interval(minutes)" />
        <CustomTextField
          onChange={(e) => handleChange(e, 'interval')}
          value={interval}
        />
      </Box>
      <Box>
        <FieldTitle title="Delay(minutes)" />
        <CustomTextField
          onChange={(e) => handleChange(e, 'delay')}
          value={delay}
        />
      </Box>
    </Stack>
  );
}

export default Interval;
