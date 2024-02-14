import { useMutation } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useSignUp = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return axiosInstance.post('/api/auth/sign-up', {
        email,
        password,
      });
    },
    mutationKey: 'use-sign-up',
  });
export { useSignUp };
