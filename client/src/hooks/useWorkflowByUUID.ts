import { QueryOptions, UseQueryOptions, useQuery } from 'react-query';
import { axiosInstance } from '@/utils/axios';

type Params = {
  uuid: string;
  options: QueryOptions;
};
const useWorkflowByUUID = ({ uuid, options }: Params) =>
  useQuery(
    ['get-workflow-by-uuid', uuid],
    async () => {
      const response = await axiosInstance.get(`/workflow/${uuid}`);
      console.log('🚀 ===== response:', response);
      return response.data;
    },
    {
      initialData: {},
      ...options,
    }
  );
export { useWorkflowByUUID };
