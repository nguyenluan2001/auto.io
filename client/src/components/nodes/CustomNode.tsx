import { Box, Stack, Typography } from '@mui/material';
import { Handle, Node, Position } from 'reactflow';
import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { useFlow } from '@/store/flow';
import { generateNode } from '@/utils/generateNode';

const handleStyle = { left: 10 };

function CustomNode(node: Node) {
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const handleClickNode = () => {
    setSelectedNode(node);
  };
  const icon = useMemo(() => {
    const nodeConfig = generateNode({
      type: node?.data?.key,
    }) as Node;
    return nodeConfig?.data?.icon;
  }, [node]);

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
        <Handle type="target" position={Position.Left} />
      )}
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon style={{ fontSize: '14px' }} icon={icon} />
        <Typography sx={{ fontWeight: '600' }}>{node?.data?.title}</Typography>
      </Stack>
      {node?.data?.description && (
        <Typography variant="caption">{node?.data?.description}</Typography>
      )}
      {/* <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" /> */}
      <RenderHandler num={node?.data?.numOfHandler || 1} />
    </Box>
  );
}
function RenderHandler({ num }: { num: number }) {
  if (num === 1) {
    return <Handle type="source" position={Position.Right} id="a" />;
  }
  return (
    <>
      {Array(num)
        .fill(0)
        .map((_, index) => {
          return (
            <Handle
              key={index}
              type="source"
              position={Position.Right}
              id={index.toString()}
              // style={{ top: (index + 1) * 10 }}
              style={{
                top: `${(100 * (index + 1)) / (num + 1)}%`,
              }}
              isConnectable
            />
          );
        })}
    </>
  );
}
export default CustomNode;
