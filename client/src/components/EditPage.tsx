import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkflowEdit from './WorkflowEdit';
import { useWorkflowByUUID } from '@/hooks/useWorkflowByUUID';
import { useFlow } from '@/store/flow';
import LoadingScreen from './common/LoadingScreen';

type Params = Record<string, string | undefined>;
function EditPage() {
  const { uuid } = useParams();
  const {
    data: workflow,
    isLoading,
    isFetching,
    refetch,
  } = useWorkflowByUUID({ uuid, options: {} });
  const {
    setNodes,
    setEdges,
    setWorkflow,
    setUUID,
    setName,
    setDescription,
    setConnectTable,
  } = useFlow((state: any) => state);
  useEffect(() => {
    if (workflow?.id) {
      setName(workflow?.name);
      setDescription(workflow?.description);
      setUUID(workflow?.uuid);
      setNodes(workflow?.config?.nodes);
      setEdges(workflow?.config?.edges);
      setWorkflow(workflow?.config?.nodes, workflow?.config?.edges);
      setConnectTable(workflow?.table);
    }
  }, [workflow]);
  console.log('🚀 ===== EditPage ===== workflow:', workflow);
  if (isLoading || isFetching) return <LoadingScreen />;
  return (
    <div>
      <WorkflowEdit refetch={refetch} />
    </div>
  );
}

export default EditPage;
