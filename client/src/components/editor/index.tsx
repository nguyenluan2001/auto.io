import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
  applyEdgeChanges,
  applyNodeChanges,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  addEdge,
  EdgeTypes,
  BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Box } from '@mui/material';
import { useFlow } from '../../store/flow';
import CustomNode from '../nodes/CustomNode';
import Toolbar from './Toolbar';
import CustomEdge from '../edge/CustomEdge';
import { nodeTypes } from '@/utils/nodeCustomType';
import { edgeTypes } from '@/utils/edgeCustomType';

type Props = {
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  setReactFlowInstance: (reactFlowInstance: any) => void;
  refetch: () => void;
};

function Editor({ onDragOver, onDrop, setReactFlowInstance, refetch }: Props) {
  const nodes: Node[] = useFlow((state: any) => state.nodes);
  const edges: Edge[] = useFlow((state: any) => state.edges);
  const addNode: (cb: (nds: Node[]) => void) => void = useFlow(
    (state: any) => state.addNode
  );
  const addEdgeFlow: (cb: (params: any) => void) => void = useFlow(
    (state: any) => state.addEdge
  );
  const setEdges = useFlow((state: any) => state.setEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      addNode((nds) => applyNodeChanges(changes, nds));
    },
    [addNode]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('🚀 ===== Editor ===== connection:', connection);
      addEdgeFlow((eds) =>
        addEdge(
          {
            ...(connection || {}),
            // type: 'smoothstep',
            type: 'customEdge',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds as Edge[]
        )
      );
    },
    [addEdgeFlow]
  );
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );
  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <Toolbar refetch={refetch} />
      <ReactFlow
        onNodesChange={onNodesChange}
        style={{ background: '#F5F5F5' }}
        // onEdgesChange={onEdgesChange}
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes as unknown as NodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
        // onNodesDelete={onNodesDelete}
      >
        <Background gap={10} variant={'dots' as BackgroundVariant} />
        <Controls />
      </ReactFlow>
    </Box>
  );
}

export default Editor;
