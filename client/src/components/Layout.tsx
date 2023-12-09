import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './sidebar/MainSidebar';

function Layout() {
  return (
    <Stack direction="row" sx={{ width: '100vw', height: '100vh' }}>
      <MainSidebar />
      <Outlet />
    </Stack>
  );
}

export default Layout;
