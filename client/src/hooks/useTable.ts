import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useTableById = ({ id, options = {} }) =>
  useQuery(
    ['get-list-tables', id],
    async () => {
      const response = await axiosInstance.get(`/tables/${id}`);
      return response.data;
    },
    {
      initialData: {},
      ...options,
    }
  );

export { useTableById };
