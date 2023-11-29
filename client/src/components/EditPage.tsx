import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkflowEdit from './WorkflowEdit';
import { useWorkflowByUUID } from '@/hooks/useWorkflowByUUID';
import { useFlow } from '@/store/flow';

function EditPage() {
  const { uuid } = useParams();
  const { data: workflow, isLoading, refetch } = useWorkflowByUUID({ uuid });
  const {
    initNodes,
    initEdges,
    initWorkflow,
    setUUID,
    setName,
    setDescription,
  } = useFlow((state) => state);
  useEffect(() => {
    if (workflow?.id) {
      setName(workflow?.name);
      setDescription(workflow?.description);
      setUUID(workflow?.uuid);
      initNodes(workflow?.config?.nodes);
      initEdges(workflow?.config?.edges);
      initWorkflow(workflow?.config?.nodes, workflow?.config?.edges);
    }
  }, [workflow]);
  console.log('🚀 ===== EditPage ===== workflow:', workflow);
  return (
    <div>
      <WorkflowEdit refetch={refetch} />
    </div>
  );
}

export default EditPage;
