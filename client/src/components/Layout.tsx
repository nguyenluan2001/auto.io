import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './sidebar/MainSidebar';
import Auth from '@/HOCs/Auth';

function Layout() {
  return (
    <Stack
      direction="row"
      sx={{ width: '100vw', height: '100vh', background: '#f1f2f3' }}
    >
      <MainSidebar />
      <Outlet />
    </Stack>
  );
}

export default Auth(Layout);
