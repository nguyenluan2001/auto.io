import { QueryOptions, UseQueryOptions, useQuery } from 'react-query';
import { Workflow } from 'models/Workflow';
import { axiosInstance } from '@/utils/axios';

type Params = {
  uuid: string | undefined;
  options: QueryOptions | undefined;
};
const useWorkflowByUUID = ({ uuid, options }: Params) =>
  useQuery<unknown, unknown, Workflow>(
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
