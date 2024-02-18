import { Stack, Typography } from '@mui/material';
import React from 'react';

function Empty() {
  return (
    <Stack direction="column" spacing={2} alignItems="center" sx={{ p: 5 }}>
      <img alt="empty" style={{ width: '100px' }} src="/empty.png" />
      <Typography variant="h4">No data found</Typography>
    </Stack>
  );
}

export default Empty;
