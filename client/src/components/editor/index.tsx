import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow';

import 'reactflow/dist/style.css';
import { useFlow } from '../../store/flow';
import CustomNode from '../nodes/CustomNode';

function Editor() {
  // const [nodes, setNodes] = useState<Node[]>(initialNodes);
  // const [edges, setEdges] = useState<Edge[]>([]);
  const { nodes, edges, setNodes, setEdges } = useFlow((state) => state);
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  console.log('🚀 ===== Editor ===== edges:', edges);
  console.log('🚀 ===== Editor ===== nodes:', nodes);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(applyEdgeChanges(changes, edges)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      // console.log('🚀 ===== Editor ===== edges:', edges);
      // const newEdges = addEdge(connection, edges);
      // console.log('🚀 ===== Editor ===== newEdges:', newEdges);
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );
  return (
    <div style={{ height: '100vh', flex: 1 }}>
      <ReactFlow
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Editor;
