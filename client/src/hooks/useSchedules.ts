import { useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

const useSchedules = () =>
  useQuery(
    ['useSchedules'],
    () =>
      axiosInstance.get('/api/schedules').then((response) => response?.data),
    {
      initialData: {
        schedules: [],
        meta: {},
      },
    }
  );
export { useSchedules };
