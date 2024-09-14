import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import {
  BaseEdge,
  EdgeLabelRenderer,
  Position,
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  useEdgesState,
} from 'reactflow';
import closeCircleOutline from '@iconify/icons-mdi/close-circle-outline';
import { useMemo } from 'react';
import { useFlow } from '@/store/flow';

type Props = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  markerEnd: string;
  data: any;
};
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
}: Props) {
  console.log('edge data', data);
  const { edges, setEdges } = useFlow();

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const handleRemoveEdge = () => {
    const newEdges = edges.filter((edge: any) => edge.id !== id);
    setEdges(newEdges);
  };

  const isHovered = useMemo(() => {
    const edge = edges?.find((item) => item.id === id);
    if (edge) {
      return edge.isHovered;
    }
    return false;
  }, [id, edges]);

  return (
    <>
      <BaseEdge markerEnd={markerEnd} id={id} path={edgePath} />
      <EdgeLabelRenderer>
        {isHovered && (
          <IconButton
            onClick={handleRemoveEdge}
            sx={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <Icon style={{ fontSize: '16px' }} icon={closeCircleOutline} />
          </IconButton>
        )}
      </EdgeLabelRenderer>
    </>
  );
}
