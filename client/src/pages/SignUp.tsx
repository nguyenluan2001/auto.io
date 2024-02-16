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
import { yupResolver } from '@hookform/resolvers/yup';
import { Icon } from '@iconify/react';
import { useCookies } from 'react-cookie';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import * as Yup from 'yup';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import FieldTitle from '@/components/common/FieldTitle';
import CustomTextField from '@/components/common/CustomTextField';
import { axiosInstance } from '@/utils/axios';
import { useSignUp } from '@/hooks/useSignUp';

function SignUp() {
  const SCHEMA = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
    repeat_password: Yup.string()
      .required('Repeat password is required')
      .test(
        'validate-password',
        'Password did not match',
        (value, context) => value === context.parent.password
      ),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      repeat_password: '',
    },
    resolver: yupResolver(SCHEMA),
    mode: 'onSubmit',
  });
  console.log('🚀 ===== SignUp ===== errors:', errors);
  const [passwordToggle, setPasswordToggle] = useState({
    password: false,
    repeat_password: false,
  });
  const [cookies, setCookie, removeCookie] = useCookies(['autoflow_token']);
  const navigate = useNavigate();
  const { data, mutateAsync, isLoading } = useSignUp();
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
  const onGoogleSuccess = async (credential) => {
    try {
      const response = await axiosInstance.post('/api/auth/google', {
        token: credential?.credential,
      });
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
    }
  };
  // const onClickSignUpGoogle = () => {
  //    window.location.href('http://localhost:3000/api/auth/google');
  // };
  return (
    <Stack direction="column" spacing={2}>
      {/* <GoogleLogin
        onSuccess={onGoogleSuccess}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      <Divider>or</Divider> */}
      <Stack spacing={2} direction="column">
        <Box>
          <FieldTitle title="Email" required />
          <Controller
            name="email"
            control={control}
            render={({ field, formState: { errors } }) => (
              <CustomTextField error={errors?.email} {...field} />
            )}
          />
        </Box>
        <Box>
          <FieldTitle required title="Password" />
          <Controller
            name="password"
            control={control}
            render={({ field, formState: { errors } }) => (
              <CustomTextField
                error={errors?.password}
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
          <FieldTitle required title="Repeat password" />
          <Controller
            name="repeat_password"
            control={control}
            render={({ field, formState: { errors } }) => (
              <CustomTextField
                error={errors?.repeat_password}
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
        <Box>
          <ul style={{ color: 'red' }}>
            {Object.values(errors)?.map((error) => <li>{error?.message}</li>)}
          </ul>
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
