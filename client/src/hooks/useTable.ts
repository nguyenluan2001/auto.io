import { useQuery } from 'react-query';
import qs from 'qs';
import { axiosInstance } from '@/utils/axios';

const useTableById = ({
  id,
  query,
  options = {},
}: {
  id: string;
  query?: any;
  options: any;
}) =>
  useQuery(
    ['get-list-tables', id, query],
    async () => {
      const stringifyQuery = qs.stringify(query);
      console.log('🚀 ===== stringifyQuery:', stringifyQuery);
      const response = await axiosInstance.get(
        `/api/tables/${id}?${stringifyQuery}`
      );
      return response.data;
    },
    {
      initialData: {},
      ...options,
    }
  );

export { useTableById };
