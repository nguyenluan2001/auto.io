import { Box, Stack, Typography } from '@mui/material';
import { Handle, Node, Position } from 'reactflow';
import { useFlow } from '@/store/flow';

const handleStyle = { left: 10 };

function CustomNode(node: Node) {
  console.log('🚀 ===== CustomNode ===== node:', node);
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const handleClickNode = () => {
    setSelectedNode(node);
  };

  return (
    <Box
      sx={{
        border: '1px solid black',
        background: 'white',
        borderRadius: 1,
        p: 1,
      }}
      onClick={handleClickNode}
    >
      {node?.data?.key !== 'trigger' && (
        <Handle type="target" position={Position.Top} />
      )}
      <Stack direction="column" alignItems="center">
        {/* {Boolean(node?.data?.icon) && node?.data?.icon} */}
        <Typography sx={{ fontWeight: '600' }}>{node?.data?.title}</Typography>
        {node?.data?.description && (
          <Typography variant="caption">{node?.data?.description}</Typography>
        )}
      </Stack>
      <Handle type="source" position={Position.Bottom} id="a" />
    </Box>
  );
}
export default CustomNode;
