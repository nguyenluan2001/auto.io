import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import chevronLeft from '@iconify/icons-mdi/chevron-left';
import {
  Edge,
  Handle,
  Node,
  Position,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@material-ui/core';
import { ICustomNodeProps } from 'models';
import { useFlow } from '@/store/flow';
import { generateNode } from '@/utils/generateNode';
import { socket } from '@/utils/socket';
import Theme, { ITheme } from '@/theme/Theme';
import Toolbar from './Toolbar';

const handleStyle = { left: 10 };

const StyledNode = styled(Box)(
  ({ theme, $selected }: { theme?: ITheme; $selected: boolean }) => ({
    background: theme?.palette.form.fieldBackgroundColor,
    border: $selected
      ? `1px solid ${theme?.palette.border.nodeSelected}`
      : 'none',
    borderRadius: '4px',
    padding: '8px 14px',
    position: 'relative',
    '&:hover .node-toolbar': {
      display: 'block',
    },
  })
);

function CustomNode(node: ICustomNodeProps) {
  const { setSelectedNode, selectedNode } = useFlow();
  const [status, setStatus] = useState(null);
  const handleClickNode = () => {
    setSelectedNode(node as unknown as Node);
  };
  const icon = useMemo(() => {
    const nodeConfig = generateNode({
      type: node?.data?.key,
    }) as Node;
    return nodeConfig?.data?.icon;
  }, [node]);

  return (
    <StyledNode
      $selected={node?.id === selectedNode?.id}
      onClick={handleClickNode}
    >
      {node?.data?.key !== 'trigger' && (
        <Handle type="target" position={Position.Left} />
      )}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon style={{ fontSize: '14px' }} icon={icon} />
        <Typography sx={{ fontWeight: '600', fontSize: '10px' }}>
          {node?.data?.title}
        </Typography>
      </Stack>
      {node?.data?.description && (
        <Typography sx={{ fontSize: '8px', marginTop: 1 }}>
          {node?.data?.description}
        </Typography>
      )}
      <Toolbar node={node} />
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
    </StyledNode>
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
