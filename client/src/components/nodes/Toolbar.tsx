import { Box, IconButton, Stack, Tooltip, styled } from '@mui/material';
import {
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  Edge,
  Node,
} from 'reactflow';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { ICustomNodeProps } from 'models';
import { useFlow } from '@/store/flow';
import Theme from '@/theme';
import ThemeConfig, { ITheme } from '@/theme/Theme';

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
    console.log('Click duplicate');
    // return true;

    console.log('🚀 ===== handleDuplicate ===== node:', node);
    const { xPos, yPos } = node;
    const newNode = {
      ...node,
      id: uuidv4(),
      position: {
        x: xPos + 50,
        y: yPos + 50,
      },
    };
    console.log('🚀 ===== handleDuplicate ===== newNode:', newNode);
    addNode((nds: Node[]) => nds.concat(newNode));
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
        >
          <Tooltip placement="top" title="Delete">
            <IconStyled onClick={handleDeleteNode}>
              <Icon style={{ fontSize: 12 }} icon="mdi:delete-outline" />
            </IconStyled>
          </Tooltip>
          <Tooltip placement="top" title="Copy" onClick={handleDeleteNode}>
            <IconStyled>
              <Icon
                style={{ fontSize: 12 }}
                icon="heroicons-outline:clipboard-copy"
              />
            </IconStyled>
          </Tooltip>
          <Tooltip placement="top" title="Duplicate">
            <IconStyled onClick={handleDuplicateNode}>
              <Icon
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 12 }}
                id={`duplicate-icon-${node?.id}`}
                icon="humbleicons:duplicate"
              />
            </IconStyled>
          </Tooltip>
        </Stack>
      </RootStyle>
    </ThemeConfig>
  );
}
export default Toolbar;
