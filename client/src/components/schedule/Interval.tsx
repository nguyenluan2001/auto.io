import React from 'react';
import { Box, Stack } from '@mui/material';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

type Props = {
  interval: number;
  delay: number;
  handleUpdate: (value: any) => void;
};
function Interval({ interval, delay, handleUpdate }: Props) {
  const handleChange = (e: any, field: string) => {
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
          onChange={(e: any) => handleChange(e, 'interval')}
          value={interval}
        />
      </Box>
      <Box>
        <FieldTitle title="Delay(minutes)" />
        <CustomTextField
          onChange={(e: any) => handleChange(e, 'delay')}
          value={delay}
        />
      </Box>
    </Stack>
  );
}

export default Interval;
