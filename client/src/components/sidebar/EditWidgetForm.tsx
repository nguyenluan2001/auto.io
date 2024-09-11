import { Box, Button, Stack, Typography } from '@mui/material';
import React, { FunctionComponent, memo, useEffect, useState } from 'react';
import {
  Edge,
  Node,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import { enqueueSnackbar } from 'notistack';
import { config } from '@/utils/nodeConfig';
import { useFlow } from '@/store/flow';
import { CustomTextArea } from '../common/styled';
import CustomTextField from '../common/CustomTextField';
import FieldTitle from '../common/FieldTitle';

function EditWidgetForm() {
  const { selectedNode, setSelectedNode } = useFlow();
  const edges = useFlow((state: any) => state.edges);
  const nodes = useFlow((state: any) => state.nodes);
  const updateNodeInformation = useFlow(
    (state: any) => state.updateNodeInformation
  );
  const setEdges = useFlow((state: any) => state.setEdges);
  const deleteNode = useFlow((state: any) => state.deleteNode);
  const [values, setValues] = useState(null);
  const [description, setDescription] = useState<string>('');
  useEffect(() => {
    setDescription(selectedNode?.data?.description as string);
  }, [selectedNode?.id, setDescription]);
  const handleChangeDescription = (e: any) => {
    const { value } = e.target;
    setDescription(value);
  };
  const handleUpdateNode = () => {
    updateNodeInformation({
      ...(values || {}),
      description,
    });
    enqueueSnackbar('Update widget successfully', {
      variant: 'success',
    });
  };
  const handleDeleteNode = () => {
    const newEdges = [selectedNode].reduce((acc, node) => {
      const incomers = getIncomers(node as Node, nodes, edges);
      const outgoers = getOutgoers(node as Node, nodes, edges);
      const connectedEdges = getConnectedEdges([node as Node], edges);

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
    setSelectedNode(null);
    deleteNode(selectedNode?.id);
  };
  return (
    <Stack direction="column" spacing={2}>
      <Box>
        <FieldTitle title="Description" />
        <CustomTextArea
          minRows={5}
          // value={selectedNode?.data?.description}
          value={description}
          onChange={handleChangeDescription}
        />
      </Box>
      <RenderForm selectedNode={selectedNode} setValues={setValues} />
      <Stack direction="row" spacing={2}>
        {selectedNode?.data?.key !== 'trigger' && (
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            color="error"
            onClick={handleDeleteNode}
          >
            Delete
          </Button>
        )}
        <Button sx={{ flex: 1 }} variant="contained" onClick={handleUpdateNode}>
          Update
        </Button>
      </Stack>
    </Stack>
  );
}

const RenderForm = memo(function ({
  selectedNode,
  setValues,
}: {
  selectedNode: any;
  setValues: any;
}) {
  return React.createElement(
    config[selectedNode.data.key] as FunctionComponent<any>,
    {
      ...selectedNode?.data,
      setValues,
      id: selectedNode?.id,
    }
  );
});

export default EditWidgetForm;
