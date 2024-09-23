import { Box, IconButton, Stack, Tooltip, styled } from '@mui/material';
import {
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Edge,
  Node,
  NodeToolbar,
  Position,
} from 'reactflow';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { ICustomNodeProps } from 'models';
import 'iconify-icon';
import React from 'react';
import { useFlow } from '@/store/flow';
import Theme from '@/theme';
import ThemeConfig, { ITheme } from '@/theme/Theme';
import Iconify from '../common/iconify';

interface Props {
  node: ICustomNodeProps;
}

const RootStyle = styled(Box)(({ theme }: { theme?: ITheme }) => ({
  background: theme?.palette.background.main,
  position: 'absolute',
  bottom: '100%',
  left: 0,
  right: 20,
  borderRadius: '4px',
  height: 'fit-content',
  display: 'none',
  padding: '4px',
  boxSizing: 'border-box',
  zIndex: 1000,
}));

const IconStyled = styled(Box)(({ theme }: { theme?: ITheme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  '&:hover': {
    background: theme?.palette.background.light,
  },
}));

function Toolbar({ node }: Props) {
  const edges = useFlow((state: any) => state.edges);
  const nodes = useFlow((state: any) => state.nodes);
  const setEdges = useFlow((state: any) => state.setEdges);
  const deleteNode = useFlow((state: any) => state.deleteNode);
  const addNode = useFlow((state: any) => state.addNode);
  const handleDuplicateNode = (e) => {
    e.stopPropagation();
    const { xPos, yPos } = node;
    const newNode = {
      ...node,
      id: uuidv4(),
      position: {
        x: xPos + 50,
        y: yPos + 50,
      },
    };
    addNode((nds: Node[]) => nds.concat(newNode as Node));
  };
  const handleDeleteNode = (e) => {
    e.stopPropagation();
    const newEdges = [node].reduce((acc, _node) => {
      const incomers = getIncomers(_node as unknown as Node, nodes, edges);
      const outgoers = getOutgoers(_node as unknown as Node, nodes, edges);
      const connectedEdges = getConnectedEdges(
        [_node as unknown as Node],
        edges
      );

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
    <ThemeConfig>
      <RootStyle
        className="node-toolbar"
        onClick={(e) => alert('Click toolbar')}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            width: '100%',
            backgroundColor: 'neutral.bgGrey',
            borderRadius: '4px',
            height: 'fit-content',
            zIndex: 100000,
          }}
          style={{}}
        >
          <Tooltip placement="top" title="Duplicate">
            <IconStyled onClick={handleDuplicateNode}>
              <Iconify
                style={{ fontSize: 12 }}
                id={`duplicate-icon-${node?.id}`}
                icon="humbleicons:duplicate"
              />
            </IconStyled>
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <IconStyled onClick={handleDeleteNode}>
              <Iconify
                style={{ fontSize: 12, color: 'red' }}
                icon="mdi:delete-outline"
              />
            </IconStyled>
          </Tooltip>
        </Stack>
      </RootStyle>
    </ThemeConfig>
  );
}
export default Toolbar;
