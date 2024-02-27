import React from 'react';
import { Box, Stack } from '@mui/material';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

type Props = {
  expression: string;
  handleUpdate: (value: any) => void;
};
function Cronjob({ expression, handleUpdate }: Props) {
  const handleChange = (e: any) => {
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
