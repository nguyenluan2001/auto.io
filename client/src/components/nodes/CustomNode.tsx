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
import React, { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@material-ui/core';
import { useFlow } from '@/store/flow';
import { generateNode } from '@/utils/generateNode';
import { socket } from '@/utils/socket';
import Theme, { ITheme } from '@/theme/Theme';

const handleStyle = { left: 10 };

const StyledNode = styled(Box)(({ theme }: { theme?: ITheme }) => ({
  background: theme?.palette.form.fieldBackgroundColor,
  border: '1px solid black',
  borderRadius: '4px',
  padding: '8px 14px',
  position: 'relative',
}));

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

  // useEffect(() => {
  //   socket.on('test', (status) => {
  //     console.log('🚀 ===== socket.on ===== status:', status);
  //     setStatus(status);
  //   });
  // }, []);

  return (
    <StyledNode onClick={handleClickNode}>
      {node?.data?.key !== 'trigger' && (
        <Handle type="target" position={Position.Left} />
      )}
      <Stack direction="row" alignItems="center" spacing={1}>
        <Icon style={{ fontSize: '14px' }} icon={icon} />
        <Typography sx={{ fontWeight: '600', fontSize: '10px' }}>
          {node?.data?.title}
        </Typography>
        {/* <Toolbar node={node} /> */}
      </Stack>
      {node?.data?.description && (
        <Typography sx={{ fontSize: '8px', marginTop: 1 }}>
          {node?.data?.description}
        </Typography>
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
function Toolbar({ node }) {
  const edges = useFlow((state: any) => state.edges);
  const nodes = useFlow((state: any) => state.nodes);
  const setEdges = useFlow((state: any) => state.setEdges);
  const deleteNode = useFlow((state: any) => state.deleteNode);
  const addNode = useFlow((state: any) => state.addNode);
  const handleDuplicateNode = (e) => {
    // e.stopPropagation();
    alert('Click duplicate');
    // return true;

    // const newNode = {
    //   ...node,
    //   id: uuidv4(),
    //   position: {
    //     x: node?.xPos * 2 + 10,
    //     y: node?.yPos + 10,
    //   },
    // };
    // console.log('🚀 ===== handleDuplicate ===== node:', node);
    // console.log('🚀 ===== handleDuplicate ===== newNode:', newNode);
    // addNode((nds: Node[]) => nds.concat(newNode));
  };
  const handleDeleteNode = (e) => {
    e.stopPropagation();
    alert('Delete node');
    return true;
    const newEdges = [node].reduce((acc, _node) => {
      const incomers = getIncomers(_node as Node, nodes, edges);
      const outgoers = getOutgoers(_node as Node, nodes, edges);
      const connectedEdges = getConnectedEdges([_node as Node], edges);

      const remainingEdges = acc.filter(
        (edge: Edge) => !connectedEdges.includes(edge)
      );

      const createdEdges = incomers.flatMap(({ id: source }) =>
        outgoers.map(({ id: target }) => ({
          id: `${source}->${target}`,
          source,
          target,
          type: 'customEdge',
        }))
      );

      return [...remainingEdges, ...createdEdges];
    }, edges);
    setEdges(newEdges);
    deleteNode(node?.id);
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
          zIndex: 1000,
        }}
        onClick={(e) => alert('Click toolbar')}
      >
        <Stack
          direction="row"
          sx={{
            width: '100%',
            backgroundColor: 'neutral.bgGrey',
            borderRadius: '4px',
            height: 'fit-content',
            zIndex: 100000,
          }}
        >
          <Tooltip placement="top" title="Delete">
            <Icon icon="mdi:delete-outline" onClick={handleDeleteNode} />
          </Tooltip>
          <Tooltip placement="top" title="Copy" onClick={handleDeleteNode}>
            <Icon icon="heroicons-outline:clipboard-copy" />
          </Tooltip>
          <Icon
            id={`duplicate-icon-${node?.id}`}
            onClick={handleDuplicateNode}
            icon="humbleicons:duplicate"
          />
        </Stack>
      </Box>
    </Theme>
  );
}
export default CustomNode;
