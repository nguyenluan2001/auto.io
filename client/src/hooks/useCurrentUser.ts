import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useCurrentUser = () =>
  useQuery(['use-current-user'], () => {
    return axiosInstance.get('/api/users/me');
  });
