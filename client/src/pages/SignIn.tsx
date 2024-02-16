import { Icon } from '@iconify/react';
import { LoadingButton } from '@material-ui/lab';
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { useSignIn } from '@/hooks/useSignIn';
import FieldTitle from '@/components/common/FieldTitle';
import CustomTextField from '@/components/common/CustomTextField';
import { axiosInstance } from '@/utils/axios';

function SignIn() {
  const SCHEMA = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email')
      .required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(SCHEMA),
    mode: 'onSubmit',
  });
  const [passwordToggle, setPasswordToggle] = useState({
    password: false,
    repeat_password: false,
  });
  const [cookies, setCookie, removeCookie] = useCookies(['autoflow_token']);
  const navigate = useNavigate();
  const { data, mutateAsync, isLoading } = useSignIn();
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
        enqueueSnackbar('Sign in successfully', {
          variant: 'success',
        });
        return navigate('/workflows');
      }
      enqueueSnackbar('Sign in failed. Please try again.', {
        variant: 'error',
      });
    } catch (error) {
      enqueueSnackbar('Sign in failed. Please try again.', {
        variant: 'error',
      });
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
        enqueueSnackbar('Sign in successfully', {
          variant: 'success',
        });
        return navigate('/workflows');
      }
      enqueueSnackbar('Sign in failed. Please try again.', {
        variant: 'error',
      });
    } catch (error) {
      enqueueSnackbar('Sign in failed. Please try again.');
    }
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2}>
        {/* <GoogleLogin
          onSuccess={onGoogleSuccess}
          onError={() => {
            console.log('Login Failed');
          }}
        /> */}
        {/* <Button
          variant="outlined"
          fullWidth
          startIcon={<Icon icon="flat-color-icons:google" />}
          onClick={login}
        >
          Sign in with Google
        </Button>
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
            Sign in
          </LoadingButton>
          <Stack direction="row" justifyContent="center" spacing={1}>
            <Typography>Don&apos;t have account?</Typography>
            <Link to="/sign-up">
              <Typography sx={{ fontWeight: 600 }}>Sign up here</Typography>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
}

export default SignIn;
