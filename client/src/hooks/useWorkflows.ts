import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useWorkflows = () =>
  useQuery(['get-list-workflow'], () =>
    axiosInstance.get('/workflows').then((data) => data?.data)
  );

export { useWorkflows };
