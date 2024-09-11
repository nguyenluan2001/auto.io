import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Node } from 'reactflow';
import WorkflowEdit from '../components/WorkflowEdit';
import { useWorkflowByUUID } from '@/hooks/useWorkflowByUUID';
import { useFlow } from '@/store/flow';
import LoadingScreen from '../components/common/LoadingScreen';

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
    selectedNode,
    setSelectedNode,
  } = useFlow((state: any) => state);
  useEffect(() => {
    if (!isLoading && !isFetching && workflow?.id) {
      setName(workflow?.name);
      setDescription(workflow?.description);
      setUUID(workflow?.uuid);
      setNodes(workflow?.config?.nodes || workflow?.nodes);
      setEdges(workflow?.config?.edges || workflow?.edges);
      setWorkflow(
        workflow?.config?.nodes || workflow?.nodes,
        workflow?.config?.edges || workflow?.edges
      );
      setConnectTable(workflow?.table);
      const newSelectedNode = workflow?.config?.nodes?.find(
        (node: Node) => node.id === selectedNode.id
      );
      setSelectedNode(newSelectedNode);
    }
  }, [workflow, isFetching, isLoading]);
  if (isLoading || isFetching) return <LoadingScreen />;
  return <WorkflowEdit refetch={refetch} />;
}

export default EditPage;
