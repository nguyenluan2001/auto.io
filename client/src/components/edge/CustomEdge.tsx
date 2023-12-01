import { Icon } from '@iconify/react';
import { IconButton } from '@mui/material';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import closeCircleOutline from '@iconify/icons-mdi/close-circle-outline';
import { useFlow } from '@/store/flow';

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { edges, setEdges } = useFlow((state) => state);
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
