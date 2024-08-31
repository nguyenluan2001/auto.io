import { Stack } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import MainSidebar from './sidebar/MainSidebar';
import Auth from '@/HOCs/Auth';
import Theme from '../theme/Theme';

function Layout() {
  return (
    <Theme>
      <Stack direction="row" sx={{ width: '100vw', height: '100vh' }}>
        <MainSidebar />
        <Outlet />
      </Stack>
    </Theme>
  );
}

export default Auth(Layout);
