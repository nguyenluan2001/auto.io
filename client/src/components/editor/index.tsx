import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  EdgeMouseHandler,
  MarkerType,
  Node,
  NodeChange,
  NodeTypes,
} from 'reactflow';

import { Box, useTheme } from '@mui/material';
import ThemeConfig, { ITheme } from '@/theme/Theme';
import { edgeTypes } from '@/utils/edgeCustomType';
import { nodeTypes } from '@/utils/nodeCustomType';
import 'reactflow/dist/style.css';
import { useFlow } from '../../store/flow';
import Toolbar from './Toolbar';
import BottomToolbar from './BottomToolbar';

type Props = {
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  setReactFlowInstance: (reactFlowInstance: any) => void;
  refetch: () => void;
};

function Editor({ onDragOver, onDrop, setReactFlowInstance, refetch }: Props) {
  const theme: ITheme = useTheme();
  const { nodes, edges, setEdges } = useFlow();

  const addNode: (cb: (nds: Node[]) => void) => void = useFlow(
    (state: any) => state.addNode
  );
  const addEdgeFlow: (cb: (params: any) => void) => void = useFlow(
    (state: any) => state.addEdge
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      addNode((nds) => applyNodeChanges(changes, nds));
    },
    [addNode]
  );
  const onConnect = useCallback(
    (connection: Connection) => {
      addEdgeFlow((eds) =>
        addEdge(
          {
            ...(connection || {}),
            // type: 'smoothstep',
            type: 'customEdge',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
            },
          },
          eds as Edge[]
        )
      );
    },
    [addEdgeFlow]
  );

  const onEdgeMouseEnter: EdgeMouseHandler = (_, edge) => {
    setEdges(
      edges?.map((item) => {
        if (item?.id === edge.id) {
          return {
            ...item,
            isHovered: true,
          };
        }
        return {
          ...item,
          isHovered: false,
        };
      })
    );
  };

  const onEdgeMouseLeave: EdgeMouseHandler = () => {
    setEdges(
      edges?.map((item) => {
        return {
          ...item,
          isHovered: false,
        };
      })
    );
  };

  return (
    <ThemeConfig>
      <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
        <Toolbar refetch={refetch} />
        <ReactFlow
          onNodesChange={onNodesChange}
          style={{ background: theme.palette.background.darkest }}
          fitView
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeTypes={nodeTypes as unknown as NodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          onEdgeMouseEnter={onEdgeMouseEnter}
          onEdgeMouseLeave={onEdgeMouseLeave}
        >
          <Background gap={10} variant={'dots' as BackgroundVariant} />
        </ReactFlow>
        <BottomToolbar />
      </Box>
    </ThemeConfig>
  );
}

export default Editor;
