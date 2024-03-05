import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { Handle, Node, Position } from 'reactflow';
import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { useFlow } from '@/store/flow';
import { generateNode } from '@/utils/generateNode';
import { socket } from '@/utils/socket';
import Theme from '@/theme/Theme';

const handleStyle = { left: 10 };

function CustomNode(node: Node) {
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const [status, setStatus] = useState(null);
  const handleClickNode = () => {
    setSelectedNode(node);
  };
  const icon = useMemo(() => {
    const nodeConfig = generateNode({
      type: node?.data?.key,
    }) as Node;
    return nodeConfig?.data?.icon;
  }, [node]);

  useEffect(() => {
    socket.on('test', (status) => {
      console.log('🚀 ===== socket.on ===== status:', status);
      setStatus(status);
    });
  }, []);

  return (
    <Box
      sx={{
        border: '1px solid black',
        background: 'white',
        borderRadius: 1,
        p: 1,
        position: 'relative',
        '&:hover': {
          '#toolbar': {
            display: 'inherit',
          },
        },
      }}
      onClick={handleClickNode}
    >
      {node?.data?.key !== 'trigger' && (
        <Handle type="target" position={Position.Left} />
      )}
      <Stack direction="row" alignItems="center">
        <Icon style={{ fontSize: '14px' }} icon={icon} />
        <Typography sx={{ fontWeight: '600', fontSize: '10px' }}>
          {node?.data?.title}
        </Typography>
        <Toolbar node={node} />
      </Stack>
      {node?.data?.description && (
        <Typography variant="caption">{node?.data?.description}</Typography>
      )}
      {/* <Handle type="source" position={Position.Bottom} id="a" />
      <Handle type="source" position={Position.Bottom} id="b" /> */}
      <RenderHandler num={node?.data?.numOfHandler || 1} />
      {status === 'RUNNING' && (
        <Icon
          icon="line-md:loading-twotone-loop"
          style={{ position: 'absolute', fontSize: '10px', top: 2, right: 2 }}
        />
      )}
      {status === 'SUCCESS' && (
        <Icon
          style={{
            color: '#19d259',
            position: 'absolute',
            fontSize: '10px',
            top: 2,
            right: 2,
          }}
          icon="mdi:success-circle-outline"
        />
      )}
      {status === 'ERROR' && (
        <Icon
          icon="material-symbols:error-outline"
          style={{
            color: 'red',
            position: 'absolute',
            fontSize: '10px',
            top: 2,
            right: 2,
          }}
        />
      )}
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
function Toolbar({ node }) {
  console.log('🚀 ===== Toolbar ===== node:', node);
  const addNode = useFlow((state: any) => state.addNode);
  const handleDuplicate = () => {
    addNode((nds: Node[]) =>
      nds.concat({
        ...node,
        id: uuidv4(),
        position: {
          x: node?.xPos + 10,
          y: node?.yPos + 10,
        },
      })
    );
  };
  return (
    <Theme>
      <Box
        id="toolbar"
        sx={{
          position: 'absolute',
          top: '-60%',
          left: 0,
          right: 0,
          borderRadius: '4px',
          height: 'fit-content',
          display: 'none',
          paddingBottom: '5px',
          boxSizing: 'border-box',
        }}
      >
        <Stack
          direction="row"
          sx={{
            width: '100%',
            backgroundColor: 'neutral.bgGrey',
            borderRadius: '4px',
            height: 'fit-content',
          }}
        >
          <Tooltip placement="top" title="Delete">
            <Icon icon="mdi:delete-outline" />
          </Tooltip>
          <Tooltip placement="top" title="Copy">
            <Icon icon="heroicons-outline:clipboard-copy" />
          </Tooltip>
          <Tooltip placement="top" title="Duplicate">
            <Icon
              onClick={handleDuplicate}
              style={{ cursor: 'pointer' }}
              icon="humbleicons:duplicate"
            />
          </Tooltip>
        </Stack>
      </Box>
    </Theme>
  );
}
export default CustomNode;
