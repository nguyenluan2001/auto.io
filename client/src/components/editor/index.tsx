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
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { Box } from '@mui/material';
import { useFlow } from '../../store/flow';
import CustomNode from '../nodes/CustomNode';
import Toolbar from './Toolbar';

function Editor({ onDragOver, onDrop, setReactFlowInstance }) {
  // const [nodes, setNodes] = useState<Node[]>(initialNodes);
  // const [edges, setEdges] = useState<Edge[]>([]);
  const nodes: Node[] = useFlow((state: any) => state.nodes);
  const edges: Edge[] = useFlow((state: any) => state.edges);
  const setNodes: (cb: (nds: Node[]) => void) => void = useFlow(
    (state: any) => state.setNodes
  );
  const setEdges: (cb: (params: any) => void) => void = useFlow(
    (state: any) => state.setEdges
  );
  // const {
  //   nodes,
  //   edges,
  //   setNodes,
  //   setEdges,
  // }: {
  //   nodes: Node[];
  //   edges: Edge[];
  //   setNodes: () => void;
  //   setEdges: () => void;
  // } = useFlow((state) => state);
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  console.log('🚀 ===== Editor ===== edges:', edges);
  console.log('🚀 ===== Editor ===== nodes:', nodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      console.log('🚀 ===== Editor ===== connection:', connection);
      setEdges((eds) =>
        addEdge(
          {
            ...(connection || {}),
            type: 'smoothstep',
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds as Edge[]
        )
      );
    },
    [setEdges]
  );
  return (
    <Box sx={{ height: '100vh', width: '100%' }}>
      <Toolbar />
      <ReactFlow
        onNodesChange={onNodesChange}
        style={{ background: '#F5F5F5' }}
        // onEdgesChange={onEdgesChange}
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onInit={setReactFlowInstance}
      >
        <Background gap={10} variant="dots" />
        <Controls />
      </ReactFlow>
    </Box>
  );
}

export default Editor;
