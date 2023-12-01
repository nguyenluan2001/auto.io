import { Stack } from '@mui/material';
import React from 'react';

function LoadingScreen() {
  return (
    <Stack
      sx={{ width: '100vw', height: '100vh', background: '#f1f2f3' }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <img src="/loading-icon.gif" alt="loading" width={200} height={200} />
    </Stack>
  );
}

export default LoadingScreen;
