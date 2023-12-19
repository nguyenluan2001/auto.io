import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSimpleBezierPath, getSmoothStepPath, getStraightPath } from 'reactflow';
import closeCircleOutline from '@iconify/icons-mdi/close-circle-outline';
import { useFlow } from '@/store/flow';

type Props = {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};
export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: Props) {
  const { edges, setEdges } = useFlow((state) => state) as {
    edges: any;
    setEdges: (edges: any[]) => void;
  };
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const handleRemoveEdge = () => {
    const newEdges = edges.filter((edge: any) => edge.id !== id);
    console.log('🚀 ===== handleRemoveEdge ===== newEdges:', newEdges);
    setEdges(newEdges);
  };

  return (
    <>
      <BaseEdge style={{ background: 'red' }} id={id} path={edgePath} />;
      <EdgeLabelRenderer>
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
      </EdgeLabelRenderer>
    </>
  );
}
