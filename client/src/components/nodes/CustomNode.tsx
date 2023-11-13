import { useCallback } from 'react';
import { Handle, Node, Position } from 'reactflow';
import { Box } from '@mui/material';
import { useFlow } from '@/store/flow';

const handleStyle = { left: 10 };

function CustomNode(node: Node) {
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const handleClickNode = () => {
    setSelectedNode(node);
  };

  return (
    <Box sx={{ border: '1px solid black' }} onClick={handleClickNode}>
      {node?.data?.name !== 'trigger' && (
        <Handle type="target" position={Position.Top} />
      )}
      <h6>{node?.data?.label}</h6>
      <Handle type="source" position={Position.Bottom} id="a" />
    </Box>
  );
}
export default CustomNode;
