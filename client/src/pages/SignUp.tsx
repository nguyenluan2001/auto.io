import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { useCookies } from 'react-cookie';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import FieldTitle from '@/components/common/FieldTitle';
import CustomTextField from '@/components/common/CustomTextField';
import { axiosInstance } from '@/utils/axios';
import { useSignUp } from '@/hooks/useSignUp';

function SignUp() {
  const { control, handleSubmit } = useForm();
  const [passwordToggle, setPasswordToggle] = useState({
    password: false,
    repeat_password: false,
  });
  const [cookies, setCookie, removeCookie] = useCookies(['autoflow_token']);
  const navigate = useNavigate();
  const { data, mutateAsync, isLoading } = useSignUp();
  console.log('🚀 ===== SignUp ===== data:', data);

  const handleTogglePassword = (type) => {
    setPasswordToggle((pre) => ({
      ...pre,
      [type]: !pre?.[type],
    }));
  };
  const onSubmit = async (values: any) => {
    try {
      const response = await mutateAsync({
        email: values?.email,
        password: values?.password,
      });
      console.log('🚀 ===== onSubmit ===== response:', response);
      if (response?.status === 200) {
        setCookie('autoflow_token', response?.data?.data?.token);
        enqueueSnackbar('Sign up successfully', {
          variant: 'success',
        });
        return navigate('/workflows');
      }
      enqueueSnackbar('Sign up failed. Please try again.', {
        variant: 'error',
      });
    } catch (error) {
      enqueueSnackbar('Sign up failed. Please try again.');
      console.log('🚀 ===== onSubmit ===== error:', error);
    }
  };
  return (
    <Stack direction="column" spacing={2}>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<Icon icon="flat-color-icons:google" />}
      >
        Sign up with Google
      </Button>
      <Divider>or</Divider>
      <Stack spacing={2} direction="column">
        <Box>
          <FieldTitle title="Email" />
          <Controller
            name="email"
            control={control}
            render={({ field }) => <CustomTextField {...field} />}
          />
        </Box>
        <Box>
          <FieldTitle title="Password" />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <CustomTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePassword('password')}
                        edge="end"
                      >
                        {passwordToggle?.password ? (
                          <Icon icon="mdi:eye-off-outline" />
                        ) : (
                          <Icon icon="mdi:eye-outline" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={passwordToggle?.password ? 'text' : 'password'}
                {...field}
              />
            )}
          />
        </Box>
        <Box>
          <FieldTitle title="Repeat password" />
          <Controller
            name="repeat_password"
            control={control}
            render={({ field }) => (
              <CustomTextField
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleTogglePassword('repeat_password')}
                        edge="end"
                      >
                        {passwordToggle?.repeat_password ? (
                          <Icon icon="mdi:eye-off-outline" />
                        ) : (
                          <Icon icon="mdi:eye-outline" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={passwordToggle?.repeat_password ? 'text' : 'password'}
                {...field}
              />
            )}
          />
        </Box>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          fullWidth
          onClick={handleSubmit(onSubmit)}
        >
          Sign up
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

export default SignUp;
