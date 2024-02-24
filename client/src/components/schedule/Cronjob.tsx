import React from 'react';
import { Box, Stack } from '@mui/material';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

function Cronjob({ expression, handleUpdate }) {
  const handleChange = (e) => {
    handleUpdate({
      expression: e?.target?.value,
    });
  };
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={2}>
      <Box>
        <FieldTitle title="Cron expression" />
        <CustomTextField onChange={handleChange} value={expression} />
      </Box>
    </Stack>
  );
}

export default Cronjob;
