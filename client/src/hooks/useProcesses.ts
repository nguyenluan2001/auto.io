import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useProcesses = ({ params, options }: { params: any; options: any }) =>
  useQuery(
    ['use-processes', params],
    () => {
      return axiosInstance
        .post('/api/processes', params)
        .then((response) => response?.data);
    },
    {
      initialData: {
        processes: [],
        meta: {},
      },
    }
  );
export { useProcesses };
