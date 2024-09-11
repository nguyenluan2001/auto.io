import { QueryOptions, UseQueryOptions, useQuery } from 'react-query';
import { Workflow } from 'models/Workflow';
import { axiosInstance } from '@/utils/axios';

type Params = {
  uuid: string | undefined;
  options: QueryOptions | undefined;
};
const useWorkflowByUUID = ({ uuid, options }: Params) =>
  useQuery<Workflow, null, Workflow>(
    ['get-workflow-by-uuid', uuid],
    async () => {
      const response = await axiosInstance.get(`/api/workflows/${uuid}`);
      return response.data;
    },
    {
      ...(options as any),
    }
  );
export { useWorkflowByUUID };
