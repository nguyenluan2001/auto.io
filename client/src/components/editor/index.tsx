import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  NodeTypes,
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
      setEdges((eds) => addEdge(connection, eds as Edge[]));
    },
    [setEdges]
  );
  return (
    <div style={{ height: '100vh', flex: 1 }}>
      <ReactFlow
        onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
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
