import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Node } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { useWorkflowByUUID } from '@/hooks/useWorkflowByUUID';
import { useFlow } from '@/store/flow';
import { useHistory } from '@/store/history';
import LoadingScreen from '../components/common/LoadingScreen';
import WorkflowEdit from '../components/WorkflowEdit';
import { getHistory, setHistory } from '@/services/dexie';

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
    setWorkflowFromHistory,
    selectedNode,
    setSelectedNode,
    uuid: flowUUID,
    name,
    description,
    nodes,
    edges,
  } = useFlow();
  const { currentId } = useHistory();
  const { addHistoryId } = useHistory();

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

  // useEffect(() => {
  //   onSetHistory({
  //     uuid: flowUUID,
  //     name,
  //     description,
  //     nodes,
  //     edges,
  //   });
  // }, [flowUUID, name, description, nodes, edges]);

  useEffect(() => {
    onGetHistory(currentId as string);
  }, [currentId]);

  const onGetHistory = async (id: string) => {
    const data = await getHistory(id);
    if (data && data.id) {
      setWorkflowFromHistory(data);
    }
  };

  const onSetHistory = async (data: any) => {
    const historyId = await setHistory({
      id: uuidv4(),
      ...data,
    });
    if (historyId) {
      addHistoryId(historyId);
    }
  };

  if (isLoading || isFetching) return <LoadingScreen />;
  return <WorkflowEdit refetch={refetch} />;
}

export default EditPage;
