import { useMutation } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useSignIn = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return axiosInstance.post('/api/auth/sign-in', {
        email,
        password,
      });
    },
    mutationKey: 'use-sign-in',
  });
export { useSignIn };
