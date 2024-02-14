import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Outlet } from 'react-router-dom';
import FieldTitle from './common/FieldTitle';
import CustomTextField from './common/CustomTextField';

function AuthLayout() {
  return (
    <Container maxWidth="sm" sx={{ my: 'auto', height: '100vh' }}>
      <Stack
        sx={{ height: '100%' }}
        spacing={5}
        direction="column"
        justifyContent="center"
      >
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          AutoFlow
        </Typography>
        <Card>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default AuthLayout;
