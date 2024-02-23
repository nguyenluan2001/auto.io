import { Stack } from '@mui/material';
import React from 'react';

function LoadingIcon() {
  return (
    <Stack
      sx={{ width: '100%', background: '#f1f2f3' }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <img src="/loading-icon.gif" alt="loading" width={50} height={50} />
    </Stack>
  );
}

export default LoadingIcon;
