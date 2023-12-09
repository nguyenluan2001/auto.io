import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useTables = ({ options = {} }) =>
  useQuery(
    ['get-list-tables'],
    async () => {
      const response = await axiosInstance.get('/tables');
      return response.data.tables;
    },
    {
      initialData: [],
      ...options,
    }
  );

export { useTables };
